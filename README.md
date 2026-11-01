# 方屿工具箱

首页为工具卡片目录，默认访问首页，也可通过 `#home` 返回。已有工具地址保持为 `#qrcode` 和 `#schematic`。

## 隐藏验证页

访问 `/lcverify?userName=...&verify=...` 会自动向飞书 webhook POST JSON 内容，其中 `userName` 和 `verify` 均保留为字符串；URL 中的值请使用 `encodeURIComponent` 编码。只发送这两个字段，缺失、空白或重复参数不发送。此页不在菜单和首页卡片中展示。

纯前端直接请求飞书，不调用 `/api/lcverify`，不依赖 Vite 或 Nginx 转发。由于飞书未提供跨域响应读取能力，采用 `mode: 'no-cors'`、`Content-Type: text/plain;charset=UTF-8`，请求体仍为 JSON 文本。页面不读取状态码或响应体，提示“已发送，处理结果待确认”；HTTP 错误、业务拒绝与成功均无法在页面上区分。2026-11-01 已向该 webhook 实测发送一次此格式的 JSON 请求，返回 HTTP 200、`{"code":0,"msg":"","data":{}}`，确认接口接受该请求；工作流内部字段绑定和执行结果仍以飞书记录为准。超时或网络异常不自动重试，刷新页面会再次提交。

部署只需发布前端构建，保留 `/lcverify` 的 SPA 页面回退。此前的 `/api/lcverify` 代理配置已移除，不再使用。隐藏路径不提供鉴权；飞书工作流需要校验 `verify` 与 `userName` 的对应关系。请求不携带浏览器凭证或 Referer；URL 参数可能进入站点访问日志，部署时应避免记录验证页 query。

侧边菜单中的「地图管理平台」在新标签页打开 [地图管理平台](https://map.voxisle.art)。

回归测试：Node 24 下运行 `node --test tests/lcverify.test.mjs`。启动开发服务后运行 `node tests/lcverify.browser.cjs`；可用 `PLAYWRIGHT_MODULE` 指定已有 Playwright 安装、`TEST_ORIGIN` 指定开发服务地址。浏览器测试拦截接口，不触发真实飞书工作流。

## 手动添加工具

编辑 `src/features/home/tools.ts`，将任意预留项的 `name`、`description`、`href` 填好即可：

```ts
{ name: '工具名称', description: '工具介绍', href: 'https://example.com/' },
```

预留了 7 张卡片；链接为空时显示禁用的“待添加”按钮。可继续复制条目或删除多余预留项。外部网站在新标签页打开，站内工具在当前页面打开。

介绍参考：[Chunker](https://www.chunker.app)、[hueblocks 项目说明](https://github.com/1280px/hueblocks)、[MCEdit](https://www.mcedit.net/)。

## 开发环境

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
