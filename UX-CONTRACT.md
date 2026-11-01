# 方屿工具箱交互约定

本文件记录现有交互与本次展示层调整，视觉规范见 DESIGN.md。业务依据为 `qrcode-API.md`、`.skills/schematic-cloud-API.md` 与 `.skills/DEVELOPMENT.md`；不增加删除、账户或权限流程。

## Canonical UI Map

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Select/Listbox | 原生 select + src/App.css | DESIGN.md | native | 浏览器键盘选择、展开检查 |
| Form | src/components/ui/index.tsx Field + 页面现有校验 | 二维码与蓝图 API 文档 | 二维码生成、上传、下载 | 浏览器校验与模拟成功/失败 |
| Scrollbar | src/index.css | DESIGN.md | 全局深浅主题 | 浏览器 computed style |
| Toast | src/components/ui/index.tsx Status | .skills/DEVELOPMENT.md | success / error 内联反馈 | status / alert 语义检查 |
| Navigation | AppLayout / Sidebar / PageHeader | App.tsx hash 路由 | 桌面侧栏 / 移动 modal dialog | 全部路由、Escape、焦点恢复 |

## 流程与状态

- `#home` 是默认目录，`#resources` 是素材目录，`#qrcode` 和 `#schematic` 保持原有工具入口；未知 hash 仍回首页。
- 站内导航保持现有路由切换和页面状态生命周期；站外链接新标签页打开。无新登录、搜索、统计或持久化业务状态。
- 二维码页面保留 URL、输出参数、Logo 文件与边框选项；不改变校验、请求 JSON、默认值、生成、预览或下载行为。关闭选项后保留已选参数。
- 蓝图保留文件格式校验、multipart 上传、密钥下载及复制；不增加删除操作或暴露删除密钥。
- 页面原有 noValidate 校验、忙碌禁用、success/error 状态及错误文案保持原样；真实请求失败仍由现有页面处理。模拟接口仅用于本地验证。
- 原生 select 接受操作系统管理的菜单样式与键盘行为。原生 dialog 负责移动导航焦点约束、背景隔离、Escape 与关闭后的焦点恢复；选择路由时关闭菜单。
- 简体中文；主题仍默认跟随系统并保存手动选择。主题切换不重置业务表单。
- Route document title policy：`页面 · 方屿工具箱`，只含公开页面名。
- 键盘可访问全部链接、按钮、选择器和上传控件；自然文档滚动，顶部偏移避免固定顶栏覆盖焦点；提供跳至主要内容链接。

## 验证

执行 `npm run lint`、`npm run build`、Premium strict audit。使用浏览器验证四个路由、深浅主题、桌面/窄屏、移动菜单键盘与焦点、二维码和蓝图的模拟成功/失败与文件下载。报告区分模拟验证与真实 API 联调；不对未运行的交互作通过声明。


## 2026-10-31 共享组件交互统一

移动菜单补充遮罩关闭、Tab/Shift+Tab 双向循环、触发器展开状态，以及切回桌面自动关闭；保留原生 dialog 的隔离和焦点恢复。Field 标签关联原控件及帮助文案；Button 使用现有 busy 标记暴露禁用与忙碌反馈。所有字段值、校验规则、请求结构、错误文案与下载行为沿用原实现。跨项目浏览器回归见同工作区 lorianmanager-fr/tests/design-interactions.cjs。


## 隐藏验证入口与外链（2026-11-01）

依据本次需求，`/lcverify` 与 `/lcverify/` 自动提交两个必填且唯一的 query 字段：userName、verify；两个字段均保留解码后的字符串原值，额外字段忽略。开发模式 effect 重放复用请求；每次重新加载会重新提交。发送中使用 status，网络失败或超时使用 alert；发送结束不代表飞书接受或完成处理。浏览器以 no-cors / text/plain 直接 POST JSON 文本，不携带凭证或 Referer，不读取状态码或响应体，因此无法区分 HTTP/业务失败与成功。15 秒超时，不自动重试。纯静态部署即可，不依赖 /api/lcverify 或服务端转发；2026-11-01 已实测 text/plain JSON 请求得到 HTTP 200 / code 0；这确认接口接受请求，不证明工作流字段绑定或执行完成。请求层统一生成参数、网络和超时错误，页面只负责显示状态与防止 effect 重放重复发送。

侧栏创作工具分组增加「地图管理平台」站外链接，与现有站外链接约定一致，在新标签页打开，并在移动菜单点击后关闭抽屉。
