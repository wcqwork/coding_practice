# 新富文本编辑器 — 前端对接接口说明

> 范围：**产品分类描述 / FAQ内容 / 视频简介** 三个模块（视频分类描述、下载分类描述暂不支持，不在本文）。
> 形态：均为**后台 JSP 表单**（ModelAndView 渲染），非 JSON API。「响应」= 后端下发给 JSP 的 model 属性；「入参」= 表单提交的请求参数。
> 核心变化：**描述内容现在原样存取纯 HTML，后端不再做 JSON 包/解**；编辑器类型用两个独立标识 `xxxEditorType` + `richTextType` 传递。

---

## 0. 通用约定（务必先看）

### 0.1 两个标识

| 标识 | 含义 | 取值 |
|------|------|------|
| `xxxEditorType`（`prodDescEditorType` / `faqEditorType` / `videoEditorType`） | **站点偏好**：该模块当前用新版还是经典编辑器 | `"1"`=新版内容编辑器 / `"0"`=经典内容编辑器 |
| `richTextType` | **当前这条描述数据的类型**（编辑回显用）；保存时前端必须回传 | `"7"`=新版富文本 / 空(`null`/不传)=经典 |

- **产品分类描述**：`prodDescEditorType` 跟随全局【产品描述撰写设置】，可双向切换，**无独立切换按钮**。
- **FAQ / 视频简介**：`faqEditorType` / `videoEditorType` 是站点级一次性切换标识，默认 `"0"`；添加页展示「切换到新版」按钮，点击调切换接口（见 §4）落标识、**永久新版、按钮隐藏、不可切回**（回退仅 DBA 改库）。

### 0.2 描述内容

- 描述内容字段就是**纯富文本 HTML**，前端提交什么、后端原样存；回显也原样返回。**不要再包 `{"type":"7","json":...}`**。
- 各模块描述字段的请求参数名 / 回显取值见下表。

| 模块 | 描述参数名（提交&回显） |
|------|------------------------|
| 产品分类描述 | `text.groupDescription`（回显 `${command.text.groupDescription}`） |
| FAQ内容 | `phoenixFaq.faqContent`（回显 `${command.phoenixFaq.faqContent}`） |
| 视频简介 | `videoText`（回显 `${command.videoText}`） |

### 0.3 保存时的提交规则（前端必须遵守）

- 用**新版**编辑器保存 → 提交 `richTextType="7"` + 描述内容(纯HTML)。
- 用**经典**编辑器保存 → `richTextType` 传空或不传。

### 0.4 后端校验（保存接口，校验不过不落库）

| 偏好 `xxxEditorType` | 要求 `richTextType` | 不符合时 |
|----------------------|---------------------|----------|
| `"1"` 新版 | 必须 `"7"` | 报错 `msg_richtext_type_must_be_new` |
| `"0"` 经典 / 其它 | 必须为空 | 报错 `msg_richtext_type_must_be_empty` |

报错通过 `form_submit_result` 页的 **`${error}`**（已国际化）返回；前端按既有错误展示逻辑处理。

---

## 1. 产品分类描述（PhoenixProdGroupController）

### 1.1 添加页　`GET /prod/group/add`
- **入参**：编辑器相关无额外入参。
- **响应(model)**：
  - `prodDescEditorType`：`"1"`/`"0"`（跟随全局产品描述偏好）。
  - 描述内容为空（新增）。

### 1.2 编辑页　`GET /prod/group/update`
- **入参**：`productGroupId`（加密串）。
- **响应(model)**：
  - `prodDescEditorType`：`"1"`/`"0"`。
  - `richTextType`：`"7"`/空（取自库 `phoenix_product_group_text.GROUP_TEXT_TYPE`）。
  - `command.text.groupDescription`：描述内容（纯 HTML）。

### 1.3 添加保存　`POST /prod/group/doAdd`
- **入参**（编辑器相关）：
  - `text.groupDescription`：描述内容（纯 HTML）。
  - `richTextType`：`"7"`（新版）/ 空（经典）。
  - （其余产品分类表单字段照旧。）
- **响应**：渲染 `phoenix_jsp/prod/form_submit_result`；校验不过时 `${error}` 为国际化文案；成功为 okmsg。

### 1.4 编辑保存　`POST /prod/group/doUpdate`
- **入参**：同 1.3，外加 `productGroupId`。
- **响应**：同 1.3。

---

## 2. FAQ内容（FAQController）

> 添加页与编辑页是**同一个 GET 接口**，加 `faqId` 区分；添加保存与编辑保存是**同一个 POST 接口**。

### 2.1 添加/编辑页　`GET /faq/edit[?faqId=xxx]`
- **入参**：`faqId`（加密串，**可选**；不传=新增）。
- **响应(model)**：
  - `faqEditorType`：`"1"`/`"0"`（站点切换标识；为 `"0"` 时前端展示「切换到新版」按钮）。
  - `richTextType`：`"7"`/空（取自 `phoenix_faq.FAQ_CONTENT_TYPE`；新增时为空）。
  - `command.phoenixFaq.faqContent`：描述内容（纯 HTML）。

### 2.2 添加/编辑保存　`POST /faq/edit`
- **入参**（编辑器相关）：
  - `phoenixFaq.faqContent`：描述内容（纯 HTML）。
  - `richTextType`：`"7"` / 空。
  - 编辑时带 `faqId`（编辑场景，加密串，放在 `phoenixFaq.faqId` 或表单原有方式）。
- **响应**：渲染 `phoenix_jsp/faq/form_submit_result`；校验不过 `${error}` 国际化。

---

## 3. 视频简介（PhoenixVideoController）

### 3.1 添加页　`GET /video/add`
- **入参**：编辑器相关无额外入参。
- **响应(model)**：
  - `videoEditorType`：`"1"`/`"0"`（站点切换标识；`"0"` 时展示「切换到新版」按钮）。
  - 描述内容为空（新增）。

### 3.2 编辑页　`GET /video/update`
- **入参**：`id`（加密串）。
- **响应(model)**：
  - `videoEditorType`：`"1"`/`"0"`。
  - `richTextType`：`"7"`/空（取自 `phoenix_video.VIDEO_DESC_TYPE`）。
  - `command.videoText`：描述内容（纯 HTML）。

### 3.3 添加保存　`POST /video/doAdd`
- **入参**（编辑器相关）：
  - `videoText`：描述内容（纯 HTML）。
  - `richTextType`：`"7"` / 空。
  - （其余视频表单字段照旧。）
- **响应**：渲染 `phoenix_jsp/video/form_submit_result`；校验不过 `${error}` 国际化。

### 3.4 编辑保存　`POST /video/doUpdate`
- **入参**：同 3.3，外加 `id`。
- **响应**：同 3.3。

---

## 4. 切换到新版编辑器接口（仅 FAQ / 视频简介）

> 产品分类描述不用此接口（跟随全局偏好）。

- **接口**：`POST /richtext/new/switchEditor`
- **入参**：`module` —— `faq`（FAQ内容）/ `video`（视频简介）。
- **响应（JSON）**：
  ```json
  { "code": "0000000", "message": "success" }      // 成功（一次性落标识，幂等）
  { "code": "000001", "message": "参数错误" }       // module 不合法（国际化 msg_richtext_parameter_error）
  ```
- **作用**：把该模块站点偏好标识置 `"1"`（永久新版）；**只存一次**，已是新版则幂等返回成功。
- ⚠ 现仅接受 `faq` / `video`；`videoCate` / `downloadCate` 已不支持，传入会返回参数错误。

---

## 5. 国际化报错 key（4 语言包均已加）

| key | 触发 | 文案（zh_CN） |
|-----|------|---------------|
| `msg_richtext_type_must_be_new` | 偏好新版但 richTextType≠"7" | 当前为新版内容编辑器，描述类型参数不正确 |
| `msg_richtext_type_must_be_empty` | 偏好经典但 richTextType 非空 | 当前为经典内容编辑器，描述类型参数不正确 |
| `msg_richtext_parameter_error` | 切换接口 module 不合法 | 参数错误 |

---

## 6. 给前端的一句话总结

1. **页面渲染**：读 `xxxEditorType` 决定用新版/经典编辑器（FAQ/视频还据它决定是否显示切换按钮）；编辑页再读 `richTextType` 判断这条老数据原本是哪种编辑器存的。
2. **保存提交**：除描述内容外，**必须带 `richTextType`**（新版`"7"`、经典空）；描述内容是**纯 HTML，原样提交**（不要包 JSON）。
3. **切换按钮**（仅 FAQ/视频）：点按钮先调 `POST /richtext/new/switchEditor`（`module=faq|video`）成功后再切到新版编辑器并隐藏按钮。
4. **报错**：保存接口若 `richTextType` 与站点偏好不匹配，会在 `form_submit_result` 的 `${error}` 给出国际化报错。
