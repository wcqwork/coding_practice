# leadong-richtext

基于 **Vue 3**、**Tiptap**、**Element Plus** 的所见即所得富文本编辑器。提供两种使用方式：

1. **Vue 组件模式**（推荐）— 作为 Vue 组件直接 `import` 使用
2. **静态部署模式** — `dist/` 静态产物通过 iframe / `<script>` 挂载

## 安装

```bash
npm install leadong-richtext
```

---

## 使用方式一：Vue 组件模式（推荐）

适合 Vue 3 项目直接集成，像普通组件一样 `import` 使用。

### 1. 安装 peer 依赖

```bash
npm install vue pinia vue-i18n element-plus @tiptap/vue-3 @tiptap/starter-kit
```

### 2. 在入口注册插件

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import LeadongRichText, { setupLeadongRichText } from 'leadong-richtext'
import 'leadong-richtext/style.css'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()
const i18n = createI18n({ locale: 'ZH_CN', messages: {} })

app.use(pinia)
app.use(i18n)
app.use(ElementPlus)
app.use(LeadongRichText, { i18n })

// 配置编辑器（对齐原 TiptapEditorMount 参数）
await setupLeadongRichText({
  defaultTiptapContent: '<p>初始内容</p>',
  onChange: (html) => {
    console.log('内容变更', html)
  },
  textEditorBlockParam: {
    pageId: 'your-page-id',
    relationId: 'your-relation-id',
    relationType: '5',
    phoenix2Authorization: 'your-jwt-or-token',
    backendDomain: 'your-backend-host',
    baseUrl: 'https://your-frontend-base/',
    cdnDomain: 'your-cdn-host',
    backendServerHost: '',
    newEditorAuth: '0',
  },
})

app.mount('#app')
```

### 3. 在页面中使用

```vue
<template>
  <LeadongRichTextEditor />
</template>
```

### `setupLeadongRichText(options)` 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `richTextEditorType` | `number` | `1` 产品 / `2` 文章（默认 `1`） |
| `taskId` | `string` | 任务 ID（可选） |
| `defaultTiptapContent` | `string` | 初始 HTML 内容（可选） |
| `onChange` | `(html) => void` | 内容变更回调（可选） |
| `exportName` | `string` | 导出名称（可选） |
| `tiptapParams` | `object` | 扩展参数（可选） |
| `textEditorBlockParam` | `object` | 区块/鉴权/后端配置（可选） |
| `skipMediaInit` | `boolean` | 跳过 initSettingMedia（默认 `false`） |

### 直接导入组件（不使用插件）

```js
import { TiptapEditor } from 'leadong-richtext'
import 'leadong-richtext/style.css'
```

---

## 使用方式二：静态部署模式

以静态构建产物 `dist/` 形式发布，适合通过 iframe 或 `<script>` 标签集成。

安装后，静态资源位于：

```text
node_modules/leadong-richtext/dist/
```

请将 **整个 `dist` 目录** 复制到你的静态服务器或 CDN（保持内部相对路径不变）。构建产物使用 `base: './'`，可部署在任意子路径下。

**注意：** 必须通过 **HTTP(S)** 访问静态资源，不要用 `file://` 打开，否则 ES Module 无法正确加载分包。

## 发布前构建（维护本仓库者）

本包在 **`npm publish` 时** 会通过 `prepublishOnly` 自动执行 `npm run build:all`，同时生成 `dist/`（应用模式）和 `lib/`（组件库模式）。

手动构建：

```bash
npm install
npm run build        # 仅构建应用 → dist/
npm run build:lib    # 仅构建组件库 → lib/
npm run build:all    # 两者都构建
```

## 部署检查清单

- 拷贝 `dist/` 下的全部内容：`index.html`、`editor.html`、`assets/`、`js/` 等。
- 每次版本升级后，**资源文件名带 content hash**，请以新版本 `index.html` / `editor.html` 为准更新引用（或直接整包替换部署）。

## 使用方式一：整页 iframe（推荐）

将 `dist` 部署到例如 `https://example.com/static/richtext/` 后：

```html
<iframe
  src="https://example.com/static/richtext/index.html"
  style="width:100%;height:800px;border:0;"
  title="富文本编辑器"
></iframe>
```

编辑器子页若需与父页同域通信，可参考源码中 `editor.html` 对 `document.domain` 与 `localStorage` 的处理；按需传参 `?domain=`（见下文「iframe 与跨子域」）。

## 使用方式二：在业务页面中挂载到指定容器

1. 将 `dist` 部署到可访问 URL 前缀（示例：`BASE = https://example.com/static/richtext`）。
2. 打开部署后的 **`dist/index.html`**，复制其中所有：
   - `<link rel="stylesheet" ...>`
   - `<script type="module" ... src="./assets/...">` 与 `modulepreload`
3. 粘贴到你的 HTML 中，并把 `href` / `src` 改为以 `BASE` 为前缀的绝对地址（或保证相对路径从你的页面到 `dist` 结构仍成立）。
4. 在页面中准备挂载节点，例如 `<div id="editor-root"></div>`。
5. 在 **主入口 ES 模块已执行完毕** 后（例如 `window load`），调用：

```html
<script>
window.addEventListener('load', function () {
  if (typeof window.TiptapEditorMount !== 'function') {
    console.error('TiptapEditorMount 未就绪，请检查是否已按 index.html 引入全部脚本');
    return;
  }
  window.TiptapEditorMount({
    containerId: '#editor-root',
    richTextEditorType: 1,
    taskId: 'your-task-id',
    defaultTiptapContent: '<p>初始 HTML</p>',
    onChange: function (html) {
      console.log('内容变更', html);
    },
    textEditorBlockParam: {
      pageId: 'your-page-id',
      relationId: 'your-relation-id',
      relationType: '5',
      phoenix2Authorization: 'your-jwt-or-token',
      backendDomain: 'your-backend-host',
      baseUrl: 'https://your-frontend-base/',
      cdnDomain: 'your-cdn-host',
      backendServerHost: '',
      newEditorAuth: '0',
    },
  });
});
</script>
```

**说明：** 仅引入单个 `assets/index-*.js` 而不引入 `index.html` 中的 CSS，会导致样式缺失；请保持与官方 `index.html` 一致的引用集合。

## 独立编辑器页（editor.html）

`dist/editor.html` 为精简 **iframe 专用入口**（与主应用相比减少部分依赖），生产构建会引用独立的入口 chunk。若父页面通过 iframe 加载编辑器子应用，可将 `src` 指向部署后的 `editor.html`，并保证同目录下 `js/`、`assets/` 可访问。

## 全局 API（`window`）

以下方法由主入口脚本挂载（与内部 `src/main.js` 行为一致），供嵌入方调用。

### `TiptapEditorMount(options)`

| 参数 | 类型 | 说明 |
|------|------|------|
| `containerId` | `string` | 挂载点选择器，如 `#app` |
| `richTextEditorType` | `number` | `1` 产品 / `2` 文章（可选，默认 `1`） |
| `taskId` | `string` | 任务 ID（可选） |
| `defaultTiptapContent` | `string` | 初始 HTML 内容（可选） |
| `onChange` | `(html: string) => void` | 内容变更回调（可选） |
| `exportName` | `string` | 导出名称相关（可选） |
| `tiptapParams` | `object` | 扩展参数（可选） |
| `textEditorBlockParam` | `object` | 区块/鉴权/后端配置（可选，见下表） |

**`textEditorBlockParam` 常用字段：**

| 字段 | 说明 |
|------|------|
| `pageId` | 页面 ID |
| `relationId` | 关联 ID |
| `relationType` | 关联类型 |
| `phoenix2Authorization` | 鉴权 token |
| `backendDomain` | 后端域名 |
| `baseUrl` | 前端基地址（用于跳转等） |
| `cdnDomain` | CDN/字体域配置，会写入 `localStorage` 键 `cdnDomainFont` |
| `backendServerHost` | 后端主机，参与拼接登录重定向等 |
| `newEditorAuth` | 新编辑器鉴权开关（字符串，`'0'` / `'1'` 等） |

该方法内部会尝试 `await initSettingMedia()`，失败时以默认配置继续，并在完成后对 `containerId` 执行 `app.mount`。

### `TiptapEditorUpdate(html)`

整体替换编辑器文档内容（字符串）。

### `TiptapEditorPaste(html)`

通过内部 `postMessage` 将 HTML 粘贴到 **Tiptap iframe**（与宿主侧 `tiptapIframeService` 配合使用）。

### 其它挂载在 `window` 的辅助方法

- `getBlockTypeCount`
- `getBlockContainerCount`
- `replaceBlockTypeWithPlaceholder`
- `isHtmlMode()`：是否处于源码模式
- `checkHtmlModeBeforeSave()`：若在源码模式则提示并返回 `true`，否则 `false`

## iframe 与跨子域

`editor.html` 支持通过 URL 参数 `domain` 设置 `document.domain`，并与父页面 `localStorage`（如 `cdnDomainFont`）同步。具体行为以部署后的 `editor.html` 内联脚本为准。

## 网络与接口

- 开发环境下的 Vite `proxy` **不会** 打入生产包。生产环境需自行配置 **CORS** 或 **反向代理**，使浏览器能访问你的业务 API、媒体与鉴权接口。
- 若接口依赖 cookie，请注意 **同源策略** 与 iframe 第三方 cookie 限制。

## 体积说明

产物包含 Vue、Element Plus、Tiptap 等，总体积较大属正常现象。需要单文件包时可在维护仓库内使用 `VITE_SINGLE_BUNDLE=true` 重新构建（与本 npm 包默认策略无关，需自行验证）。

## 许可证

MIT — 见仓库内 `LICENSE`。

## 相关仓库

本 npm 包名 **`leadong-richtext`** 与历史内部工程名可能不同；问题反馈请指向实际维护的 Git 远程与版本号。
