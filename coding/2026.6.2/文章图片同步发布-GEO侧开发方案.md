# 文章图片同步发布 — phoenix-geo 侧开发方案

> **需求背景**：在增长引擎（GEO）中编辑的文章包含图片，通过"发布/更新"将文章同步至独立站后台时，需自动将图片上传至目标站点的资料库，并将文章正文中的原始图片链接替换为资料库的 FFS URL。更新发布时同一图片不重复上传；资料库空间不足时向用户报错。

---

## 一、方案架构概览

### 核心前提：图片已在资料库，但 URL 随 COM_ID 变化

Dify 编辑器插入图片时已调用 `phoenix/aiArticleUpload` 将图片上传至**固定站资料库（fixedComId）**，文章 `ARTICLE_CONTEXT` 里的 `img src` 是以 fixedComId 编码的 FFS URL：

```
//cdn.xxx/cloud/{EncryptTool.encode("fixedComId_pid")}/{pname}
```

**COM_ID 更新后，URL 必须重新生成**（用 targetComId 重新编码）。

### 整体架构：一个 phoenix 接口完成所有图片工作（全同步）

GEO 调用 phoenix 单个接口 `POST /phoenix/admin/richtext/new/processImages`（与 `aiArticleUpload` 同 Controller），该接口**全程同步**执行：

1. 校验配额
2. UPDATE `photobank_photo_info.COM_ID`
3. 生成 targetComId FFS URL
4. UPDATE `phoenix_article_text.ARTICLE_TEXT`
5. 返回新 URL 给 GEO

GEO 拿到新 URL 后直接写文章，整个发布流程纯同步，无任何异步。

```
═══════════════════════ 同步主流程（用户等待）════════════════════════════════
GEO 前端 → POST /article/{id}/publish
         → DifyArticleServiceImpl.createPublishArticle()   ← @DSTransactional
              ├── [原有] 解析目标站点 comId / lanCode / siteSettingId
              ├── [原有] upsertPhoenixArticle → 得到 phoenixArticleId
              ├── [新增] ArticleImageSyncService.processImages()
              │    ├── 提取 articleContext 中所有 <img src> FFS URL（fixedComId 编码）
              │    ├── 过滤 IMAGE_URL_MAP 缓存（key=fixedUrl）：
              │    │    ├── 全部命中 → 直接用缓存中的 targetComId URL，跳过 HTTP 调用
              │    │    └── 有新 URL → HTTP POST /phoenix/admin/richtext/new/processImages
              │    │         ├── phoenix 解码 URL → PHOTO_ID → 校验配额
              │    │         │   空间不足 → SPACE_FULL → GEO 抛 IMAGE_SPACE_FULL → 终止
              │    │         │   空间充足 → UPDATE COM_ID
              │    │         │            → 生成 targetComId FFS URL
              │    │         │            → UPDATE phoenix_article_text（旧URL→新URL）
              │    │         └── 响应：{ photos:[{oldFfsUrl, newFfsUrl}] }
              │    └── 返回 ImageSyncResult { fullUrlReplaceMap:{fixedUrl→targetUrl} }
              ├── [新增] replaceContentUrls（用 fullUrlReplaceMap 替换 phoenix_article_text）
              ├── [原有] markArticleSynced
              └── [新增] 更新 dify_article.IMAGE_URL_MAP（主事务内，无后置异步）
══════════════════════════════════════════════════════════════════════════════
```

### 关键设计决策

| 问题 | 决策 | 原因 |
|------|------|------|
| 图片是否需要下载/上传？ | **不需要** | Dify 编辑器插图时已调用 `aiArticleUpload` 入库，FFS URL 已在文章内容里 |
| FFS URL 是否随 COM_ID 变化？ | **是**，URL 含 `EncryptTool.encode(comId_pid)`，comId 变则 URL 变 | 需要用 targetComId 重新生成 URL |
| 图片相关工作在哪里做？ | **全部在 phoenix 侧**，GEO 只调一个接口 | 空间校验、PHOTO_ID 解码、URL 生成、COM_ID 更新均需 EncryptTool，GEO 无法完成 |
| phoenix 接口如何执行？ | **全程同步**：校验 → UPDATE COM_ID → 生成新 URL → UPDATE article_text → 返回 | 实现最简单，无需队列管理；phoenix 处理完成后 GEO 直接拿新 URL 写文章 |
| GEO 侧有异步任务吗？ | **完全没有**，GEO 侧纯同步 | phoenix 接口全同步，GEO 无需 afterCommit 回调 |
| IMAGE_URL_MAP 存什么？ | `{fixedComIdUrl → targetComIdUrl}`，写入主事务 | 下次「更新发布」命中缓存直接替换，跳过 phoenix HTTP 调用 |
| GEO 本地内容是否替换 URL？ | **否**，`dify_article.ARTICLE_CONTEXT` 保留 fixedComId URL 原样 | GEO 编辑器展示不受影响；IMAGE_URL_MAP 记录转换关系 |


---

## 二、数据库变更

### 2.1 `dify_article` 表新增字段

```sql
ALTER TABLE dify_article 
  ADD COLUMN IMAGE_URL_MAP LONGTEXT NULL 
  COMMENT '图片URL映射缓存，JSON格式：{"原始URL":"FFS_URL;PHOTO_ID", ...}，发布时用于去重';
```

**字段说明**：

- 存储已完成 COM_ID 归属回写的图片 URL 映射，格式：
  ```json
  {
    "//cdn.xxx/cloud/{fixedEncodeId}/img.jpg": "//cdn.xxx/cloud/{targetEncodeId}/img.jpg"
  }
  ```
- key = 原始 FFS URL（fixedComId 编码，来自 Dify 编辑器上传时生成）
- value = 目标站 FFS URL（targetComId 编码，由 phoenix `photoSyncComplete` 返回）
- 作用：下次「更新发布」同一文章时，命中缓存直接用 value（targetComId URL）写入独立站，跳过 phoenix HTTP 调用
- 每次发布成功后追加；旧记录保留（支持历史图片去重）

---

## 三、涉及改动文件清单


| 模块 | 文件/类 | 变更类型 | 说明 |
|------|---------|---------|------|
| `common` | `DifyArticle.java` | 修改 | 新增 `imageUrlMap` 字段（fixedUrl→targetUrl 映射） |
| `common` | `ArticleErrorCode.java` | 修改 | 新增 1 个错误码（`IMAGE_SPACE_FULL`） |
| `api` | `ArticleImageSyncService.java` | **新建** | 提取 FFS URL、过滤缓存、调用 phoenix `processImages`，返回完整 URL 替换 Map |
| `api` | `DifyArticleService.java` | 不改 | 接口签名不变 |
| `api` | `DifyArticleServiceImpl.java` | 修改 | 写文章前替换缓存命中 URL；调 phoenix processImages 处理新图片；主事务内更新 IMAGE_URL_MAP |
| `frontend` | `ArticlePublishDialog.vue` | 修改 | 新增 `IMAGE_SPACE_FULL` 错误提示 |
| **phoenix** | `POST /difyArticle/processImages` | **新增接口** | 全同步：校验配额 → UPDATE COM_ID → 生成新 URL → UPDATE article_text → 返回新 URL |


---

## 四、后端改动详情

### 4.1 `DifyArticle.java` — 新增字段

`backend/common/src/main/java/com/leadong/entity/DifyArticle.java` 新增：

```java
/**
 * 图片URL映射缓存（JSON格式）
 * key = 原始图片URL，value = "FFS_URL;PHOTO_ID"
 * 发布时用于去重，避免同一图片重复上传
 */
@TableField("IMAGE_URL_MAP")
private String imageUrlMap;
```

---

### 4.2 `ArticleErrorCode.java` — 新增错误码

`backend/common/src/main/java/com/leadong/constants/ArticleErrorCode.java` 新增：

```java
IMAGE_SPACE_FULL("IMAGE_SPACE_FULL", "目标站点资料库空间不足，图片同步失败，文章发布已中止"),
IMAGE_UPLOAD_FAILED("IMAGE_UPLOAD_FAILED", "图片上传至目标站点资料库失败，文章发布已中止"),
```

---

### 4.3 `ArticleImageSyncService.java` — 图片处理服务

> **职责**：提取文章 FFS URL → 过滤 IMAGE_URL_MAP 缓存 → 对新 URL 调用 phoenix `processImages`（同步返回新 URL） → 返回完整替换 Map。  
> **GEO 侧完全无异步**，所有异步工作由 phoenix 内部队列承接。

`backend/api/src/main/java/com/leadong/service/ArticleImageSyncService.java`：

```java
package com.leadong.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leadong.constants.ArticleErrorCode;
import com.leadong.entity.DifyArticle;
import com.leadong.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 文章图片处理服务（全同步）
 *
 * 图片已由 Dify 编辑器通过 aiArticleUpload 入库，img src 为 fixedComId 编码的 FFS URL。
 * 发布时：
 *   - 缓存命中的图片（IMAGE_URL_MAP 有记录）：直接返回缓存中的 targetComId URL
 *   - 新图片：调 phoenix processImages（全同步：校验配额 → UPDATE COM_ID → 生成新 URL → UPDATE article_text）
 * 最终返回完整 URL 替换 Map（fixedUrl → targetUrl），供写文章时替换内容使用。
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ArticleImageSyncService {

    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;

    @Value("${phoenix.api.base-url:}")
    private String phoenixBaseUrl;

    @Value("${phoenix.api.process-images-path:/richtext/new/processImages}")
    private String processImagesPath;

    private static final Pattern IMG_SRC_PATTERN =
            Pattern.compile("<img[^>]+src=[\"']([^\"']+)[\"']", Pattern.CASE_INSENSITIVE);

    /**
     * 主入口：获取完整 URL 替换 Map，供 DifyArticleServiceImpl 使用。
     *
     * @param article     GEO 文章实体（含 IMAGE_URL_MAP 缓存）
     * @param targetComId 目标站点 comId
     * @return ImageSyncResult，含 fullUrlReplaceMap: {fixedUrl → targetUrl}
     */
    public ImageSyncResult processImages(DifyArticle article, Integer targetComId) {
        String html = article.getArticleContext();
        if (StringUtils.isBlank(html)) {
            return ImageSyncResult.noOp();
        }

        List<String> allFfsUrls = extractImageUrls(html);
        if (allFfsUrls.isEmpty()) {
            return ImageSyncResult.noOp();
        }

        // 解析缓存（key=fixedComIdUrl, value=targetComIdUrl）
        Map<String, String> cache = parseUrlCache(article.getImageUrlMap());

        // 最终替换 Map（含缓存命中 + 新处理）
        Map<String, String> fullReplaceMap = new HashMap<String, String>();
        List<String> newFfsUrls = new ArrayList<String>();

        for (String url : allFfsUrls) {
            if (cache.containsKey(url)) {
                fullReplaceMap.put(url, cache.get(url));
            } else {
                newFfsUrls.add(url);
            }
        }

        if (!newFfsUrls.isEmpty()) {
            // 调用 phoenix processImages（全同步）：校验 → UPDATE COM_ID → 生成新 URL → UPDATE article_text
            // phoenixArticleId 此时未知，传 0；调用方后续通过 notifyPhoenixArticleId 触发 article_text 更新
            Map<String, String> newUrlMap = callProcessImages(targetComId, 0L, newFfsUrls);
            fullReplaceMap.putAll(newUrlMap);
            log.info("[ImageSync] processImages 完成: articleId={}, newCount={}",
                    article.getArticleId(), newFfsUrls.size());
        }

        return new ImageSyncResult(fullReplaceMap);
    }

    // ==================== HTTP 调用 phoenix processImages ====================

    /**
     * 调用 phoenix POST /difyArticle/processImages（全同步）。
     *
     * phoenix 执行：
     *   解码 fixedComId URL → PHOTO_ID → 校验 targetComId 配额
     *   → 空间不足返回 SPACE_FULL → GEO 抛 IMAGE_SPACE_FULL
     *   → UPDATE photobank_photo_info.COM_ID
     *   → 生成 targetComId FFS URL
     *   → UPDATE phoenix_article_text.ARTICLE_TEXT（若 phoenixArticleId > 0）
     *   → 返回 {oldFfsUrl → newFfsUrl} 映射
     *
     * @return {fixedComIdUrl → targetComIdUrl} 映射
     */
    @SuppressWarnings("unchecked")
    private Map<String, String> callProcessImages(Integer targetComId, Long phoenixArticleId,
                                                   List<String> ffsUrls) {
        if (StringUtils.isBlank(phoenixBaseUrl)) {
            log.warn("[ImageSync] phoenix.api.base-url 未配置，跳过图片处理");
            return new HashMap<String, String>();
        }
        try {
            Map<String, Object> req = new HashMap<String, Object>();
            req.put("targetComId", targetComId);
            req.put("phoenixArticleId", phoenixArticleId);
            req.put("ffsUrls", ffsUrls);

            ResponseEntity<Map> resp = restTemplate.postForEntity(
                    phoenixBaseUrl + processImagesPath, req, Map.class);

            if (resp.getBody() == null) {
                log.warn("[ImageSync] processImages 无响应，跳过");
                return new HashMap<String, String>();
            }
            String code = String.valueOf(resp.getBody().get("code"));
            if ("SPACE_FULL".equals(code)) {
                throw new BusinessException(ArticleErrorCode.IMAGE_SPACE_FULL);
            }
            if (!"0000000".equals(code)) {
                log.warn("[ImageSync] processImages 异常 code={}，跳过", code);
                return new HashMap<String, String>();
            }

            // 解析 data.photos → {oldFfsUrl → newFfsUrl}
            Map<String, String> result = new HashMap<String, String>();
            Map<?, ?> data = (Map<?, ?>) resp.getBody().get("data");
            if (data != null) {
                List<?> photos = (List<?>) data.get("photos");
                if (photos != null) {
                    for (Object p : photos) {
                        Map<?, ?> photo = (Map<?, ?>) p;
                        String oldUrl = String.valueOf(photo.get("oldFfsUrl"));
                        String newUrl = String.valueOf(photo.get("newFfsUrl"));
                        if (StringUtils.isNotBlank(oldUrl) && StringUtils.isNotBlank(newUrl)) {
                            result.put(oldUrl, newUrl);
                        }
                    }
                }
            }
            return result;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.warn("[ImageSync] 调用 processImages 失败，降级跳过: {}", e.getMessage());
            return new HashMap<String, String>();
        }
    }

    // ==================== 工具方法 ====================

    List<String> extractImageUrls(String html) {
        List<String> urls = new ArrayList<String>();
        if (StringUtils.isBlank(html)) return urls;
        Matcher m = IMG_SRC_PATTERN.matcher(html);
        while (m.find()) {
            String src = m.group(1).trim();
            if (StringUtils.isNotBlank(src) && !urls.contains(src)) urls.add(src);
        }
        return urls;
    }

    private Map<String, String> parseUrlCache(String json) {
        if (StringUtils.isBlank(json)) return new HashMap<String, String>();
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, String>>() {});
        } catch (Exception e) {
            log.warn("[ImageSync] IMAGE_URL_MAP 解析失败，重置: {}", json);
            return new HashMap<String, String>();
        }
    }

    // ==================== 内部 DTO ====================

    public static class ImageSyncResult {
        /**
         * 完整 URL 替换 Map：{fixedComIdUrl → targetComIdUrl}
         * 含缓存命中 + 本次 processImages 返回，DifyArticleServiceImpl 写文章时全量替换
         */
        public final Map<String, String> fullUrlReplaceMap;

        public ImageSyncResult(Map<String, String> fullUrlReplaceMap) {
            this.fullUrlReplaceMap = fullUrlReplaceMap;
        }

        public boolean hasReplacements() {
            return fullUrlReplaceMap != null && !fullUrlReplaceMap.isEmpty();
        }

        public static ImageSyncResult noOp() {
            return new ImageSyncResult(new HashMap<String, String>());
        }
    }
}
```

---

### 4.4 `DifyArticleServiceImpl.java` — 改造 `createPublishArticle`

> **变化要点**：
> - 注入 `ArticleImageSyncService`，无需任何异步 Bean
> - 先调 `processImages` 拿到完整 URL 替换 Map（缓存命中 + 新图片）
> - 写文章前在内存中替换缓存命中的 URL，传给 `upsertPhoenixArticle`
> - 新图片由 phoenix `processImages` 全同步处理（含 article_text 更新）
> - 主事务内更新 `IMAGE_URL_MAP`，**无 afterCommit 回调**

**新增注入**（类头部）：

```java
private final ArticleImageSyncService articleImageSyncService;
```

**改造 `createPublishArticle`**：

```java
@Override
@DSTransactional
public ArticlePublishResultVO createPublishArticle(Long organizationId, Long articleId,
                                                    ArticlePublishReqDTO req) {
    // ...(原有校验逻辑不变)...
    PublishContext ctx = resolvePublishContext(article);

    // ======== [新增 Step1] 图片预处理：得到完整 URL 替换 Map ========
    // 缓存命中的图片直接从 IMAGE_URL_MAP 取新 URL
    // 新图片调 phoenix processImages（同步：校验配额 → UPDATE COM_ID → 生成新 URL → UPDATE article_text）
    // 此时 phoenixArticleId 尚未生成，新图片的 article_text 更新由 phoenix 在 upsertPhoenixArticle 之后处理
    ArticleImageSyncService.ImageSyncResult syncResult =
            articleImageSyncService.processImages(article, ctx.comId);
    // =============================================================

    // ======== [新增 Step2] 写文章前，将缓存命中的 URL 替换到内容中 ========
    // 新图片的 URL 替换由 phoenix processImages 完成（article_text 层面）
    // 此处仅处理 IMAGE_URL_MAP 已有缓存的图片（不再走 phoenix）
    ctx.articleContextToPublish = applyUrlReplace(article.getArticleContext(),
                                                   syncResult.cachedUrlMap);
    // ====================================================================

    // [原有] 写文章（使用替换后的内容），得到 phoenixArticleId
    Long phoenixArticleId = upsertPhoenixArticle(article, ctx);

    // ======== [新增 Step3] 新图片的 article_text 由 phoenix 已同步更新，GEO 无需再操作 ========
    // 若有新图片，通知 phoenix 更新 article_text（传入 phoenixArticleId）
    if (syncResult.hasNewUrls()) {
        articleImageSyncService.notifyPhoenixArticleId(syncResult, ctx.comId, phoenixArticleId);
    }
    // =======================================================================================

    updateArticleUrl(phoenixArticleId, article, ctx);
    markArticleSynced(article, phoenixArticleId, ctx);

    // ======== [新增 Step4] 主事务内更新 IMAGE_URL_MAP 缓存 ========
    if (syncResult.hasReplacements()) {
        updateImageUrlMap(article, syncResult.fullUrlReplaceMap);
    }
    // =============================================================

    ArticlePublishResultVO result = new ArticlePublishResultVO();
    result.setArticleUrl(fullUrl);
    result.setIsNewArticle(ctx.isNew);
    return result;
}
```

> **说明**：`processImages` 拆为两步是因为 `phoenixArticleId` 在 `upsertPhoenixArticle` 后才生成。实际实现中可将两步合并（先空传 articleId=0 让 phoenix 做 COM_ID+URL 生成，`upsertPhoenixArticle` 后再传 articleId 触发 article_text 更新），具体拆分方式由联调确认。

**新增 `applyUrlReplace`**（内存字符串替换，无 DB 操作）：
```java
private String applyUrlReplace(String content, Map<String, String> urlMap) {
    if (StringUtils.isBlank(content) || urlMap == null || urlMap.isEmpty()) return content;
    for (Map.Entry<String, String> e : urlMap.entrySet()) {
        content = content.replace(e.getKey(), e.getValue());
    }
    return content;
}
```

**新增 `updateImageUrlMap`**（写缓存，主事务内）：
```java
@SuppressWarnings("unchecked")
private void updateImageUrlMap(DifyArticle article, Map<String, String> newUrls) {
    Map<String, String> cache;
    try {
        cache = StringUtils.isBlank(article.getImageUrlMap())
                ? new HashMap<String, String>()
                : objectMapper.readValue(article.getImageUrlMap(),
                        new TypeReference<Map<String, String>>() {});
    } catch (Exception e) {
        cache = new HashMap<String, String>();
    }
    cache.putAll(newUrls);
    try {
        article.setImageUrlMap(objectMapper.writeValueAsString(cache));
        article.setUpdateTime(LocalDateTime.now());
        difyArticleMapper.updateById(article);
    } catch (Exception e) {
        log.error("[ImageSync] IMAGE_URL_MAP 写入失败: articleId={}", article.getArticleId(), e);
    }
}
```

---

### 4.5 配置项新增

`backend/api/src/main/resources/application.yml`：

```yaml
phoenix:
  api:
    base-url: http://phoenix-server-host:port                       # 各环境单独配置（即 https://www.leadong.com/phoenix）
    process-images-path: /admin/richtext/new/processImages          # 与 aiArticleUpload 同 Controller
```

`RestTemplate` Bean 配置（若不存在则新增）：

```java
@Bean
public RestTemplate restTemplate() {
    return new RestTemplate();
}
```

---

## 五、phoenix 侧配套接口设计规格（供联调）

> 本节为 phoenix 项目开发方提供的接口设计约定，**GEO 侧根据此规格调用，phoenix 侧按此实现**。  
> 接口与 `aiArticleUpload` 放在同一 Controller，遵循相同的编码风格（`@Controller` + `PhoenixResponseUtils.renderJson`）。

### 5.1 接口位置

| 项目 | 路径 |
|------|------|
| **文件** | `TtnSmartPreview/src/main/java/com/focustech/subsys/smart/web/controller/admin/PhoenixNewRichTextController.java` |
| **类路径** | `@RequestMapping("/richtext/new")` |
| **方法路径** | `@RequestMapping(value = "/processImages")` |
| **完整 URL** | `POST /phoenix/admin/richtext/new/processImages` |
| **参照接口** | `aiArticleUpload`（同文件，`/richtext/new/aiArticleUpload`） |

### 5.2 请求与响应规格

**Content-Type**：`application/json`（GEO 发送 JSON body，phoenix 从 request 流读取）

#### 请求体

```json
{
  "targetComId": 12345,
  "phoenixArticleId": 9876543,
  "ffsUrls": [
    "//cdn.leadong.com/cloud/{fixedEncodeId1}/img.jpg",
    "//cdn.leadong.com/cloud/{fixedEncodeId2}/bg.png"
  ]
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `targetComId` | int | 目标站点的 comId |
| `phoenixArticleId` | long | 本次发布写入 phoenix 的文章 ID（用于更新 `phoenix_article_text`） |
| `ffsUrls` | string[] | 待处理的 fixedComId FFS URL 列表（GEO 已过滤缓存，此处均为新图片） |

#### 处理逻辑（全同步，顺序执行）

```
1. 解码 & 查尺寸
   for each ffsUrl:
     encodeId = URL path 第2段（/cloud/{encodeId}/{pname}）
     decoded  = EncryptTool.decodeText(encodeId)  →  "fixedComId_photoId"
     photoId  = decoded.split("_")[1]
     pname    = URL path 最后一段
     size     = SELECT PHOTO_SIZE FROM photobank_photo_info WHERE PHOTO_ID = photoId

2. 空间校验
   totalSize = sum(size in KB)
   capacity  = SELECT CAPACITY FROM photobank_capacity_rec WHERE COM_ID = targetComId  (MB)
   used      = SELECT USED_SPACE FROM photobank_capacity_use_status WHERE COM_ID = targetComId  (KB)
   if used + totalSize > capacity * 1024:
     return { code: "SPACE_FULL" }

3. 更新 COM_ID
   UPDATE photobank_photo_info
   SET COM_ID = targetComId
   WHERE PHOTO_ID IN (photoId1, photoId2, ...)

4. 生成新 FFS URL
   for each (photoId, pname):
     newFfsUrl = PhoenixFFSUtils.getInstance().ffsResourceUrlWithComId(targetComId, photoId, pname, "0", "0")

5. 更新 phoenix_article_text
   UPDATE phoenix_article_text
   SET ARTICLE_TEXT = REPLACE(REPLACE(ARTICLE_TEXT, oldFfsUrl1, newFfsUrl1), oldFfsUrl2, newFfsUrl2),
       UPDATE_TIME  = NOW()
   WHERE ARTICLE_ID = phoenixArticleId

6. 返回新 URL
```

#### 成功响应

```json
{
  "code": "0000000",
  "message": "success",
  "data": {
    "photos": [
      { "oldFfsUrl": "//cdn.leadong.com/cloud/{fixedEncodeId1}/img.jpg",
        "newFfsUrl": "//cdn.leadong.com/cloud/{targetEncodeId1}/img.jpg" },
      { "oldFfsUrl": "//cdn.leadong.com/cloud/{fixedEncodeId2}/bg.png",
        "newFfsUrl": "//cdn.leadong.com/cloud/{targetEncodeId2}/bg.png" }
    ]
  }
}
```

#### 空间不足响应

```json
{ "code": "SPACE_FULL", "message": "目标站点资料库空间不足" }
```

**幂等要求**：同一 `photoId` / `phoenixArticleId` 多次调用须安全。  
**GEO 降级**：非 `SPACE_FULL` 异常 → GEO 记录 warn，文章以 fixedComId URL 发布（可正常访问），下次重试。

### 5.3 phoenix 侧实现骨架

在 `PhoenixNewRichTextController.java` 中新增方法（与 `aiArticleUpload` 风格完全一致）：

```java
/**
 * 文章图片归属迁移：更新 COM_ID 并生成目标站 FFS URL
 * 供 GEO 发布文章时同步调用，全程阻塞返回
 *
 * 请求体（JSON）：
 * {
 *   "targetComId": 12345,
 *   "phoenixArticleId": 9876543,
 *   "ffsUrls": ["//cdn.xxx/cloud/xxx/img.jpg", ...]
 * }
 */
@RequestMapping(value = "/processImages")
public String processImages(HttpServletRequest request, HttpServletResponse response) {
    Map<String, Object> result = new HashMap<String, Object>();
    try {
        // 1. 解析 JSON 请求体
        String body = org.apache.commons.io.IOUtils.toString(request.getInputStream(), "UTF-8");
        JSONObject reqJson = JSONObject.fromObject(body);
        Integer targetComId    = reqJson.getInt("targetComId");
        Long    phoenixArticleId = reqJson.getLong("phoenixArticleId");
        JSONArray ffsUrlArray  = reqJson.getJSONArray("ffsUrls");

        if (targetComId == null || ffsUrlArray == null || ffsUrlArray.isEmpty()) {
            result.put("code", "000001");
            result.put("message", "参数错误");
            PhoenixResponseUtils.renderJson(response, result);
            return null;
        }

        // 2. 解码 FFS URL，查询 PHOTO_SIZE，校验空间
        List<Map<String, Object>> photoInfoList = new ArrayList<Map<String, Object>>();
        long totalSizeKb = 0L;
        for (int i = 0; i < ffsUrlArray.size(); i++) {
            String ffsUrl = ffsUrlArray.getString(i);
            // 从 URL 中提取 encodeId（格式：//cdn.xxx/cloud/{encodeId}/{pname}）
            String[] pathParts = ffsUrl.split("/");
            String encodeId = pathParts[pathParts.length - 2];
            String pname    = pathParts[pathParts.length - 1];
            // EncryptTool 解码得 "fixedComId_photoId"
            String decoded  = com.focustech.subsys.smart.phoenix.utils.EncryptTool.decodeText(encodeId);
            String photoId  = decoded.split("_")[1];

            // 查询 PHOTO_SIZE（从 photobank_photo_info 表，单位 KB）
            // TODO: 注入对应的 Mapper/Service，替换以下伪查询
            long photoSize = /* photoBankService.selectPhotoSize(photoId) */ 0L;
            totalSizeKb += photoSize;

            Map<String, Object> info = new HashMap<String, Object>();
            info.put("photoId", photoId);
            info.put("pname",   pname);
            info.put("oldFfsUrl", ffsUrl);
            photoInfoList.add(info);
        }

        // 查询目标站配额和已用空间
        // TODO: 注入对应的 Mapper/Service
        long capacityKb = /* photoBankService.selectCapacityKb(targetComId) */ Long.MAX_VALUE;
        long usedKb     = /* photoBankService.selectUsedSpaceKb(targetComId) */ 0L;
        if (usedKb + totalSizeKb > capacityKb) {
            result.put("code", "SPACE_FULL");
            result.put("message", "目标站点资料库空间不足");
            PhoenixResponseUtils.renderJson(response, result);
            return null;
        }

        // 3. 批量 UPDATE COM_ID
        List<String> photoIds = new ArrayList<String>();
        for (Map<String, Object> info : photoInfoList) {
            photoIds.add((String) info.get("photoId"));
        }
        // TODO: photoBankService.batchUpdateComId(photoIds, targetComId);

        // 4. 生成新 FFS URL + 5. 更新 phoenix_article_text
        List<Map<String, String>> photos = new ArrayList<Map<String, String>>();
        String articleText = /* phoenixArticleTextMapper.selectContentByArticleId(phoenixArticleId) */ "";
        for (Map<String, Object> info : photoInfoList) {
            String photoId  = (String) info.get("photoId");
            String pname    = (String) info.get("pname");
            String oldFfsUrl = (String) info.get("oldFfsUrl");
            String newFfsUrl = PhoenixFFSUtils.getInstance()
                    .ffsResourceUrlWithComId(targetComId, photoId, pname, "0", "0");
            articleText = articleText.replace(oldFfsUrl, newFfsUrl);

            Map<String, String> photo = new HashMap<String, String>();
            photo.put("oldFfsUrl", oldFfsUrl);
            photo.put("newFfsUrl", newFfsUrl);
            photos.add(photo);
        }
        // TODO: phoenixArticleTextMapper.updateContentByArticleId(phoenixArticleId, articleText);

        // 6. 返回结果
        Map<String, Object> data = new HashMap<String, Object>();
        data.put("photos", photos);
        result.put("code", "0000000");
        result.put("message", "success");
        result.put("data", data);
        PhoenixResponseUtils.renderJson(response, result);
        return null;

    } catch (Exception e) {
        logger.error("[processImages][Fail]", e);
        result.put("code", "000001");
        result.put("message", "error");
        PhoenixResponseUtils.renderJson(response, result);
        return null;
    }
}
```

> **TODO 说明**：骨架中标注 `TODO` 的部分（DB 查询/更新）需 phoenix 开发方按已有 Service/Mapper 填充，逻辑与 `aiArticleUpload` 中 `buildPhotoBankUploadUrl` 的 DB 访问模式一致。

---

## 六、前端改动详情

### 6.1 `ArticlePublishDialog.vue` — 新增空间不足提示

在 `handlePublish` 的 catch 块中，识别 `IMAGE_SPACE_FULL` 错误码，展示专属错误提示：

```typescript
const handlePublish = async () => {
  if (!props.articleId || !selectedSiteId.value) return
  publishing.value = true
  try {
    const res = await doPublish(false)
    const url = res ?? ''
    resultUrl.value = url
    ElMessage.success(props.isUpdate ? '已更新发布' : '发布成功')
    emit('published', url)
  } catch (e: any) {
    const errorCode = e?.errorCode ?? e?.response?.data?.code
    if (errorCode === 'ARTICLE_DELETED_FROM_SITE') {
      // ...(原有逻辑不变)...
    } else if (errorCode === 'IMAGE_SPACE_FULL') {
      ElMessage.error({
        message: '目标站点资料库空间不足，图片无法同步，文章发布失败。请清理资料库空间后重试。',
        duration: 5000,
        showClose: true,
      })
    } else if (errorCode === 'IMAGE_UPLOAD_FAILED') {
      ElMessage.error({
        message: '文章图片上传至目标站点资料库失败，请稍后重试或检查网络连接。',
        duration: 5000,
        showClose: true,
      })
    } else {
      ElMessage.error(e?.response?.data?.message || '发布失败')
    }
  } finally {
    publishing.value = false
  }
}
```

---

## 七、关键约束与待确认事项

### 7.1 关键约束

1. **图片已在资料库，无需下载上传**：Dify 编辑器插图时已入库，`ARTICLE_CONTEXT` 中 `img src` 即 FFS URL，GEO 发布不做任何文件 I/O。
2. **FFS URL 随 COM_ID 变化**：`encodeId = EncryptTool.encode("comId_pid")`，更新 COM_ID 后必须重新生成 URL（targetComId 编码），独立站文章需使用新 URL。
3. **所有图片工作由 phoenix 单接口全同步完成**：GEO 只调一次 `processImages`；空间校验、COM_ID 更新、URL 生成、article_text 回写全由 phoenix 同步执行，GEO 等待响应后拿到新 URL。
4. **phoenix 接口全程同步**：简单直接，无队列管理；GEO 收到响应后直接用新 URL 写文章，无中间态，无异步。
5. **IMAGE_URL_MAP 主事务内写入**：收到 phoenix 新 URL 后在主事务内更新缓存（key=fixedUrl, value=newTargetUrl），下次"更新发布"命中缓存跳过 HTTP 调用。
7. **GEO 本地 `ARTICLE_CONTEXT` 不修改**：保留 fixedComId URL，编辑器正常展示；IMAGE_URL_MAP 记录转换关系。
8. **`phoenix_article_text.ARTICLE_TEXT` 字段已确认**：主键 `ARTICLE_ID`（bigint），内容字段 `ARTICLE_TEXT`（text），通过 MySQL MCP 实查确认。

### 7.2 待确认事项

| 序号 | 问题 | 影响范围 | 状态 |
|------|------|---------|------|
| **P1** | phoenix `processImages` 骨架（5.3 节）TODO 占位需 phoenix 开发方填充具体 Service/Mapper | `PhoenixNewRichTextController.processImages` | ⏳ phoenix 开发方实现后联调 |
| **P2** | phoenix `processImages` 是否需要鉴权 Header（同 `aiArticleUpload` 是否免鉴权？） | `ArticleImageSyncService.callProcessImages` | ⏳ phoenix 开发方确认 |
| **P3** | `phoenix_article_text.ARTICLE_TEXT` 字段已确认（DB 实查），主键 `ARTICLE_ID` | phoenix 骨架 articleText 查询 TODO | ✅ 已确认 |
| **P4** | 文章中是否存在非 FFS 协议的图片（如 `data:image/base64`、外链图片）？若有，是跳过还是阻断？ | `extractImageUrls` 过滤逻辑 | ⏳ 产品确认 |

---

## 八、整体流程示意

```
═══════════════════ 用户点击"发布"（全程同步，无任何异步）═══════════════════

  前提：Dify 编辑器插图时已调用 aiArticleUpload
        img src = fixedComId FFS URL（已在固定站资料库）

  Step 1: upsertPhoenixArticle → 得到 phoenixArticleId

  Step 2: 提取文章中所有 FFS URL（fixedComId 编码）

  Step 3: 解析 IMAGE_URL_MAP 缓存
          ├─ 全部命中 → fullUrlReplaceMap = 缓存中的 Map，跳过 HTTP → 直接 Step 5
          └─ 有新 URL → 进入 Step 4

  Step 4: POST /phoenix/admin/richtext/new/processImages
          请求：{ targetComId, phoenixArticleId, ffsUrls:[新图片URL列表] }
          │
          ├─ phoenix（全程同步执行）：
          │    解码 URL → PHOTO_ID → 查 size → 校验配额
          │    空间不足 → SPACE_FULL
          │              → ❌ GEO 抛 IMAGE_SPACE_FULL → 前端报错，发布终止
          │    空间充足 → UPDATE photobank_photo_info.COM_ID
          │             → 生成 targetComId FFS URL
          │             → UPDATE phoenix_article_text（oldUrl→newUrl）
          │             → 返回 { photos:[{oldFfsUrl, newFfsUrl}] }
          │
          └─ GEO 合并 {缓存命中 + 新生成} → fullUrlReplaceMap

  Step 5: replaceContentUrls（用 fullUrlReplaceMap 替换 phoenix_article_text.ARTICLE_TEXT）
          （缓存命中的图片此处补替换；新图片 phoenix 已在 Step 4 更新，此处幂等无害）

  Step 6: updateImageUrlMap（主事务内写 dify_article.IMAGE_URL_MAP，key=fixedUrl, val=newUrl）

  ✅ 返回发布成功

══════════════════════════════════════════════════════════════════════════════

【更新发布（IMAGE_URL_MAP 全部命中）】
  全部 FFS URL 命中缓存 → fullUrlReplaceMap = 缓存 → 跳过 phoenix HTTP 调用 → ✅ 最快路径

【资料库空间不足】
  processImages 返回 SPACE_FULL → 抛 IMAGE_SPACE_FULL → 前端提示"目标站点资料库空间不足..."
  → 发布终止，独立站原内容不变

【降级：phoenix 接口超时/异常（非 SPACE_FULL）】
  GEO 记录 warn，IMAGE_URL_MAP 暂不写
  文章以 fixedComId URL 发布（仍可正常访问）
  下次发布同图片重新触发
```


