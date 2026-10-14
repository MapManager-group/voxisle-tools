# 方屿工具箱设计约定

## 方向与依据

面向 Minecraft 创作者的简体中文工具目录与文件工具。按本次用户指定的 [Flowbite Admin Dashboard](https://github.com/themesberg/flowbite-admin-dashboard) 重构：固定 64px 顶栏、256px 白色侧栏、浅灰工作区、带细边框与轻阴影的卡片。采用模板的 sidebar、navbar-dashboard、settings 表单和 Flowbite 组件配方，保留 React/Vite 架构。

这次系统级调整替代 `.skills/DESIGN.md` 的深蓝浮动侧栏与蓝青配色；其 Vue 路径不是本工具箱所有者。布局不添加模板中的虚构统计、搜索、账户或通知功能。

## Token 路径

采用运行时所有者模式：`tailwind.config.js` 是品牌蓝和 Slate 灰阶的唯一色值源，`src/index.css` 使用 PostCSS `theme()` 引用它，并维护语义、主题、滚动条变量；`src/App.css` 使用 Tailwind `@apply` 和这些变量组合共享组件。没有另一个导出主题。

- 主品牌蓝 `primary.700` #004C97；交互蓝 `primary.600` #1765BB（保证白字对比度）；焦点 `primary.500` #3180E3；浅背景 #EFF7FF；柔和蓝 #D9ECFF；深色文字强调 #8AC2FF。
- 日落橙只用于投稿提示：文字 #B84700、背景 #FFEAD7；深色为 #FAB479 / #432B1D。不作为成功或危险色。
- 浅色工作台 #F8FAFC、表面 #FFFFFF、边框 #E2E8F0、标题 #0F172A、正文 #334155、辅助 #64748B。
- 深色工作台 #0F172A、表面 #1E293B、控件 #334155、文字 #E2E8F0、辅助 #94A3B8。
- 标准控件与卡片圆角 8px；按钮/输入高 44px；图标按钮 40px；复选框保持 18px，不继承文本输入框尺寸。
- 字体沿用 Inter / PingFang SC / Microsoft YaHei / system-ui；标题 24–30px、卡片标题 18px、正文和控件 14px、辅助 12px；标识和密钥用系统等宽字体。不加载远程字体。

## 布局与组件

- `AppLayout` / `Sidebar` / `PageHeader` / `AppFooter` 是公共框架，`Card` / `Field` / `Button` / `Status` / `EmptyState` 是共享展示所有者。
- 侧栏依次为「概览：工具首页」「创作工具：Schematic Cloud、二维码生成器」「素材资源：素材网站」。当前路由显示背景、字重、圆点及 `aria-current`。
- 1024px 以下使用顶栏菜单按钮打开原生 modal dialog 导航，支持 Escape、原生焦点约束和焦点恢复，保留完整文字。替代开发规范中旧图标栏方案。
- 主内容最大 1440px，内边距 16/24/32px；自然文档滚动。卡片网格最小列宽 260px，窄屏单列。1100px 以下表单与结果按文档顺序单列。
- 表单采用 Flowbite 原生输入、复选框、select 样式；select 的展开菜单由操作系统负责，不承诺自定义弹层几何。
- 标签为 Flowbite 紧凑圆角 badge，内容与语义来自原数据；状态提示保持成功/失败文字和 live region。
- 深浅色选择保持 `voxisle-theme` 存储规则；默认跟随系统。滚动条全局可见，支持 forced-colors；动画尊重 reduced-motion。

## 业务边界与验证

`App.tsx` 的 hash 路由、`config.ts`、`lib`、工具和素材数据、QR 与蓝图页面的参数、状态、校验及请求保持原样。API 状态检查只在工具页面运行。站外链接仍在新标签页打开。每个路由的文档标题使用「页面 · 方屿工具箱」。

本次修改需执行 ESLint、TypeScript/Vite 构建、Premium 静态审计，并在浏览器检查全部路由、深浅色、窄屏导航、键盘、表单与文件交互。模拟接口验证与真实 API 联调分别报告。
