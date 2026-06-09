# 定时抓取 Job 工作流程

## 概述

定时抓取系统通过 `CrawlTriggerJob` 每分钟扫描一次待触发记录，到达触发时间后自动创建抓取任务。

---

## 涉及数据表

| 表名 | 说明 |
|------|------|
| `phoenix_geo_site_crawl_config` | 网站抓取配置（深度、频率、引擎、范围等） |
| `phoenix_geo_crawl_trigger` | 触发计划记录（定时队列） |
| `phoenix_geo_keyword_search_task` | 抓取任务主表 |
| `phoenix_geo_keyword_search_task_info` | 任务关键词详情表（每个关键词一条） |
| `phoenix_geo_keyword_collect` | 用户关键词库 |
| `phoenix_geo_search_engines` | 搜索引擎配置 |

---

## 表字段说明

### phoenix_geo_crawl_trigger

| 字段 | 说明 |
|------|------|
| trigger_id | 主键 |
| organization_id | 组织ID |
| site_id | 网站ID |
| status | 0=待触发, 1=已触发, 2=已取消 |
| trigger_time | 计划触发时间 |
| crawl_frequency | 抓取频率（天数，1-14） |
| actual_trigger_time | 实际触发时间 |
| task_ids | 生成的任务ID列表（JSON） |

### phoenix_geo_site_crawl_config

| 字段 | 说明 |
|------|------|
| config_id | 主键 |
| organization_id | 组织ID |
| site_id | 网站ID |
| retrieval_depth | 检索深度（1-10页） |
| regular_crawl | 是否定期抓取：0=否, 1=是 |
| crawl_frequency | 频率（天数） |
| selected_engines | 选中的搜索引擎ID列表（JSON） |
| crawl_range_type | 抓取范围：0=全部, 1=指定分组 |
| crawl_range_group_ids | 指定分组ID列表（JSON） |

### phoenix_geo_keyword_search_task

| 字段 | 说明 |
|------|------|
| task_id | 主键 |
| task_type | 1=手动抓取, 2=定期/全量抓取 |
| status | 0=未开始, 1=进行中, 2=已完成, 3=失败 |
| keyword_count | 关键词数量 |
| cost_points | 消耗点数 |
| search_engine_snapshot | 搜索引擎配置快照（JSON） |
| engines_id | 关联搜索引擎ID |
| crawl_scope_type | 0=全部, 1=指定分组, 2=指定关键词 |
| crawl_scope_detail | 范围详情（JSON，分组ID数组等） |
| is_read | 0=未读, 1=已读 |

---

## Job 执行流程

### 1. 定时扫描（每1分钟）

```
CrawlTriggerJob.execute()
├── 查询: SELECT FROM phoenix_geo_crawl_trigger
│         WHERE status = '0' AND trigger_time <= NOW() + 1分钟
├── 无记录 → 结束
└── 有记录 → 遍历每条 trigger
```

**代码位置**: `backend/tasks/src/main/java/com/leadong/task/CrawlTriggerJob.java`

### 2. 执行触发（CrawlTriggerExecutionService.executeTrigger）

```
executeTrigger(trigger)
│
├── Step 0: 检查网站是否存在
│   └── 不存在 → 删除 trigger 记录，结束
│
├── Step 1: 读取 phoenix_geo_site_crawl_config
│   └── regular_crawl != '1' → 取消(status=2)，结束
│
├── Step 2: 解析 selected_engines（JSON → List<Long>）
│   └── 为空 → 取消，结束
│
├── Step 3: 根据引擎ID查询 phoenix_geo_search_engines 获取详细配置
│   └── 无有效引擎 → 取消，结束
│
├── Step 3.5: 判断 crawl_range_type
│   ├── '0'(全量) → createFullCrawlTasks()
│   └── '1'(指定分组) → insertTargetedCrawlTasks()
│
├── Step 4-5: 创建任务（详见下方）
│
├── Step 6: 更新 trigger: status='1', actual_trigger_time=NOW(), task_ids=JSON
│
└── Step 7: 创建下一条 trigger: trigger_time = NOW() + crawl_frequency天, status='0'
```

**代码位置**: `backend/tasks/src/main/java/com/leadong/service/CrawlTriggerExecutionService.java`

### 3. 创建任务详情

**全量模式 (crawl_range_type='0')**:
```
FOR 每个搜索引擎:
  1. INSERT phoenix_geo_keyword_search_task (task_type='2', status='0', crawl_scope_type='0')
  2. INSERT SELECT INTO phoenix_geo_keyword_search_task_info
     FROM phoenix_geo_keyword_collect (该站所有关键词, rank_position=-1, search_status='0')
  3. 扣除点数 = keyword_count × retrieval_depth
```

**指定分组模式 (crawl_range_type='1')**:
```
1. 解析 crawl_range_group_ids → groupIds
2. 查询分组关联的 collectId 列表
FOR 每个搜索引擎:
  1. INSERT phoenix_geo_keyword_search_task (task_type='2', status='0', crawl_scope_type='1')
  2. INSERT SELECT INTO phoenix_geo_keyword_search_task_info
     FROM phoenix_geo_keyword_collect WHERE collect_id IN (...)
  3. 扣除点数
```

---

## 数据表操作时序（以实际 trigger_id=8 为例）

| 步骤 | 时间 | 表 | 操作 |
|------|------|------|------|
| 1 | 16:02 | `crawl_trigger` | Job 发现 id=8, trigger_time=05-31 16:01:21 已到期 |
| 2 | 16:02 | `site_crawl_config` | 读取 site_id=446 的配置 |
| 3 | 16:02 | `search_engines` | 根据 selected_engines 读取引擎配置 |
| 4 | 16:02 | `keyword_search_task` | INSERT → 生成 task_id=16 |
| 5 | 16:02 | `keyword_search_task_info` | INSERT SELECT 从 keyword_collect 复制所有关键词 |
| 6 | 16:02 | `crawl_trigger` id=8 | UPDATE status='1', actual_trigger_time, task_ids='[16]' |
| 7 | 16:02 | `crawl_trigger` 新记录 | INSERT id=13, trigger_time=06-01 (NOW+1天), status='0' |

---

## 如何提前触发

### 方法一：修改数据库（推荐）

```sql
-- 将待触发记录的 trigger_time 改为当前时间
UPDATE phoenix_geo_crawl_trigger
SET trigger_time = NOW()
WHERE site_id = <你的网站ID>
  AND status = '0';
```

Job 会在下一分钟自动检测到并执行，效果等同于正常定时触发（会自动创建下一条触发记录）。

### 方法二：使用"更新排名"按钮

在"关键词管理"页面手动点击"更新排名"，调用 `POST /keyword-ranking/targeted-crawl` 接口。

**区别**: 不会影响定时计划，原来的 trigger 仍按原时间执行。

### 方法三：调用全量抓取 API

```
POST /keyword-ranking/full-crawl
{
  "siteId": <网站ID>,
  "searchEngines": [<搜索引擎配置>]
}
```

同样不影响定时计划。

---

## 相关代码文件索引

| 文件 | 说明 |
|------|------|
| `backend/tasks/src/main/java/com/leadong/task/CrawlTriggerJob.java` | 定时调度入口，每1分钟执行 |
| `backend/tasks/src/main/java/com/leadong/service/CrawlTriggerExecutionService.java` | 触发执行逻辑 |
| `backend/common/src/main/java/com/leadong/service/CrawlTriggerService.java` | Trigger CRUD 接口 |
| `backend/common/src/main/java/com/leadong/service/impl/CrawlTriggerServiceImpl.java` | Trigger CRUD 实现 |
| `backend/common/src/main/java/com/leadong/service/impl/KeywordRankingServiceImpl.java` | 创建任务核心逻辑 |
| `backend/common/src/main/resources/mapper/ldgldb/CrawlTriggerMapper.xml` | Trigger SQL |
| `backend/common/src/main/resources/mapper/ldgldb/KeywordSearchTaskInfoMapper.xml` | 任务详情 SQL |
| `backend/common/src/main/java/com/leadong/entity/CrawlTrigger.java` | Trigger 实体 |
| `backend/common/src/main/java/com/leadong/entity/SiteCrawlConfig.java` | 抓取配置实体 |
| `backend/common/src/main/java/com/leadong/entity/KeywordSearchTask.java` | 任务实体 |
| `backend/api/src/main/java/com/leadong/service/impl/SiteCrawlConfigServiceImpl.java` | 配置保存/读取 |
| `frontend/src/components/UpdateWebsiteRankingDialog.vue` | 前端更新排名弹框 |
| `frontend/src/api/keywordRanking.ts` | 前端 API 定义 |

---

## 注意事项

1. **每个搜索引擎生成独立任务**: 如果配置了 2 个搜索引擎，会生成 2 条 task 记录和 2 条排名查询记录。
2. **点数消耗公式**: `关键词数 × 检索深度 × 选中引擎数`
3. **互斥检查**: 同一网站同一搜索引擎配置不能同时有两个进行中的任务。
4. **下一次触发时间**: 基于 `NOW() + crawl_frequency天`（不是基于上次计划时间），所以如果延迟触发，后续时间会顺延。
