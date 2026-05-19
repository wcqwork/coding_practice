# 08-目录组件保存静态 HTML，前台不实时更新，每次编辑更新（产品、文章、FAQ、下载、图册、列表排除）

## 需求范围

目录组件保存策略：

- 保存静态 HTML。
- 前台不实时重新扫描正文生成目录。
- 每次进入编辑器编辑并保存后更新目录内容。
- 已确认“产品、文章、FAQ、下载、图册、列表排除”指排除这些动态内容模块里的标题；目录组件仍可用于产品/文章等编辑器页面。
- 动态内容排除范围包括产品动态内容、文章动态内容、FAQ 动态内容、下载动态内容、图册动态内容、列表动态内容。

本任务负责静态快照生成、保存链路、动态内容过滤、前台已有全局 JS 接入约定和测试覆盖。

## 当前代码依据

- iframe 内获取 HTML：`phoenix-ai-generate-products/src/views/editorPage/index.vue` 中 `editor.getHTML()`。
- 父页接收编辑器状态：`phoenix-ai-generate-products/src/views/contentEditRichText/index.vue`。
- 对外 `onChange(html)` 注册：`phoenix-ai-generate-products/src/main.js`。
- 全局状态：`phoenix-ai-generate-products/src/stores/home.js` 中 `tiptapEditorOnChange`、`richTextEditorType`。
- 宿主上下文：`phoenix-ai-generate-products/src/stores/editorConfig.js` 中 `relationType`、`relationId`、`pageId`。
- BlockType 占位相关：`phoenix-ai-generate-products/src/components/tiptap-extensions/BlockType/useBlockTypePlaceholder.js`。
- 自定义 HTML 导出参考：`phoenix-ai-generate-products/src/utils/exportHtml.js`。
- 属性保留机制：`phoenix-ai-generate-products/src/components/tiptap-extensions/PreserveAttrs.js`。
- 目录组件工具函数建议：`phoenix-ai-generate-products/src/components/tiptap-extensions/TableOfContents/tableOfContentsUtils.js`。
- 前台交互不由目录组件新增独立 runtime；目录组件需要输出可被 Phoenix 站点已有全局 JS 识别的标准结构与 `data-*` 标记。

## 静态保存原则

目录组件的前台展示必须来自保存时固化的 HTML 和 attrs：

1. 编辑器中正文标题变化时，目录组件在编辑器内刷新。
2. `editor.getHTML()` 输出时，目录组件 HTML 已包含最新目录项快照。
3. 宿主保存该 HTML。
4. 前台访问时直接渲染保存的目录项。
5. 前台已有全局 JS 只负责展开/收起、点击跳转、active 同步，不重新扫描正文生成或修改目录项。

## 数据保存建议

目录组件 attrs：

```js
{
  levels: [2, 3],
  listStyle: 'none',
  title: 'Table of Contents',
  items: [
    {
      id: 'toc-heading-a1',
      targetId: 'toc-heading-a1',
      anchor: '',
      hasCustomAnchor: false,
      text: 'Heading',
      level: 2,
      order: 0
    }
  ],
  updatedAt: 1710000000000
}
```

HTML 输出：

- 外层 `data-table-of-contents="1"`。
- `data-levels` 保存层级配置。
- `data-list-style` 保存列表样式。
- `data-toc-items` 保存完整静态快照 JSON。
- 同时输出可见目录项 DOM，保证前台无 JS 时也能看到目录。
- 目标标题输出 `data-toc-target-id`，有锚点时保留 `id`/锚点。

## 动态内容排除策略

实现前需要整理动态内容模块的稳定识别标记。计划默认分两层：

1. 按 Tiptap Node 类型排除。
   - 仅排除已明确承载产品、文章、FAQ、下载、图册、列表等动态内容的数据模块。
   - `blockType` 只有在其配置或宿主标记能确认属于上述动态内容时才排除。
   - `htmlBlock`、`thirdPartyBlock` 不默认整体排除；只有内部或外层带有明确动态内容标记时才排除，避免误漏用户静态 HTML 中的标题。
   - 其它后续明确为产品/文章/FAQ/下载/图册/列表的自定义 Node。

2. 按 DOM/data 标记排除。
   - `[data-dynamic-module]`
   - `[data-module-type="product"]`
   - `[data-module-type="article"]`
   - `[data-module-type="faq"]`
   - `[data-module-type="download"]`
   - `[data-module-type="gallery"]`
   - `[data-module-type="list"]`
   - Phoenix 宿主已有的动态模块 class 或 data 属性。

默认规则：只提取编辑器正文中静态 heading Node；动态模块内部即使含 `h1-h6` 也不参与目录。

## 实施步骤

1. 建立目录快照生成函数。
   - `buildTableOfContentsSnapshot(editor, tocAttrs, options)`。
   - 从当前 Tiptap doc 提取静态标题。
   - 根据 `levels` 过滤可见项。
   - 排除动态内容模块。
   - 生成 `items`、`targetId`、`anchor`、`updatedAt`。

2. 建立全量刷新函数。
   - `refreshAllTableOfContents(editor, reason)`。
   - 遍历文档中所有 `tableOfContents` Node。
   - 对每个目录组件根据自身 attrs 生成快照。
   - 比较新旧快照，只有变化时 `setNodeMarkup`。
   - 防止目录更新触发无限 transaction。

3. 接入编辑器更新链路。
   - 在目录组件 Node plugin 或 `editorPage/index.vue` 的发送 HTML 前调用刷新。
   - 推荐优先在 Tiptap extension 内监听 transaction，保持功能内聚。
   - 发送给父页 `TIPTAP_EDITOR_STATE` 前确保 `editor.getHTML()` 已包含最新目录快照。

4. 接入初始化/回显。
   - 初始 content 进入编辑器后，先按保存的 `items` 展示。
   - 编辑器 ready 后异步刷新一次，确保正文和目录同步。
   - 如果正文未变化，避免无意义改写 HTML 造成宿主误判内容变更。

5. 处理源码模式。
   - 源码模式下不实时刷新目录。
   - 从源码模式回到内容模式后，解析 HTML 并刷新目录快照。
   - 如果用户手动编辑了目录 HTML，解析失败时保留可见 DOM 或回退为空目录，并给出可恢复提示。

6. 前台不实时生成。
   - 前台已有全局 JS 不扫描全文生成目录项。
   - 全局 JS 只读取现有 `[data-table-of-contents] .toc-item`。
   - 如果页面正文标题变了但目录 HTML 没变，前台仍显示旧目录，符合“每次编辑更新”要求。

7. 前台全局 JS 接入。
   - 目录组件不在静态 HTML 中注入内联脚本，也不输出独立 runtime。
   - 目录组件输出 `[data-table-of-contents]`、`data-toc-anchor`、`data-toc-target-id`、`data-toc-toggle` 等标准标记。
   - Phoenix 前台已有全局 JS 负责识别这些标记并实现点击跳转、收起展开、hash 定位和多目录 active 同步。
   - 如果现有全局 JS 没有对应能力，需要在宿主全局脚本侧扩展。

8. 动态模块排除联调。
   - 用产品、文章、FAQ、下载、图册、列表模块样例确认 DOM/Node 标记。
   - 在 `isExcludedDynamicHeading(node, context)` 中集中维护排除规则。
   - 不使用标题文本猜测模块类型。

9. 保存体积与兼容性。
   - 标题很多时 `data-toc-items` JSON 可能较大，需要确认宿主字段长度限制。
   - 可见 DOM 与 JSON 双存会增加 HTML 体积；若体积敏感，可仅保存可见 DOM + 必要 data 属性。
   - 计划默认双存，方便重开编辑器恢复配置与前台全局 JS 定位。

## 测试场景

- 新增目录组件后保存，前台显示目录。
- 修改正文标题但不保存，前台目录不变化。
- 修改正文标题并保存，前台目录更新。
- 新增/删除 H2/H3 后保存，目录快照更新。
- 页面包含产品动态内容标题，目录不提取该标题。
- 页面包含文章动态内容标题，目录不提取该标题。
- 页面包含 FAQ/下载/图册/列表动态内容标题，目录不提取这些标题。
- 源码模式切换后目录组件仍能解析和刷新。
- 多个目录组件保存后都包含各自配置和快照。
- 标题重复、特殊字符、多语言标题保存后跳转仍稳定。

## 验收标准

- `editor.getHTML()` 输出中目录组件包含静态目录项 DOM。
- 保存后重开编辑器，目录配置和目录项正确回显。
- 前台页面不依赖重新扫描正文即可显示目录。
- 前台已有全局 JS 不生成新目录项，只绑定已有目录项交互。
- 动态内容模块中的 H 标签不进入目录快照。
- 普通 `htmlBlock`、`thirdPartyBlock` 中的静态标题不因块类型被默认排除；只有带明确动态内容标记时才排除。
- 静态正文中的 H1-H6 按设置层级进入目录快照。
- 修改正文并保存后，目录 HTML 更新。
- 修改正文但未保存时，前台目录保持旧版本。

## 风险与依赖

- 本仓库未包含完整 Phoenix 前台保存 API，最终保存时机需要和宿主 `onChange(html)` / 后端落库链路联调。
- `BlockType` 是否属于动态内容不能只按类型判断，需要结合区块配置或宿主标记；目录快照应基于用户可见的静态正文，而不是动态占位内部内容。
- 动态模块排除必须依赖稳定 Node 类型或 data 标记，不能靠文本或样式猜测。
- 如果前台公共 JS 未扩展目录组件识别逻辑，则目录只能静态展示，点击/展开/hash/active 同步不可用。
