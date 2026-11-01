---
version: alpha
colors:
  primary: '#004C97'
  primary-hover: '#003B75'
  primary-soft: '#EFF7FF'
  canvas: '#F8FAFC'
  surface: '#FFFFFF'
  dark-canvas: '#0F172A'
  dark-surface: '#1E293B'
  text: '#334155'
  muted: '#64748B'
  border: '#E2E8F0'
typography:
  body:
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Microsoft YaHei, sans-serif'
    fontSize: '14px'
    lineHeight: 1.5
  heading:
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Microsoft YaHei, sans-serif'
    fontSize: '24px'
    fontWeight: 700
rounded:
  control: '8px'
  card: '8px'
spacing:
  navbar-height: '64px'
  sidebar-width: '256px'
  logo-size: '36px'
  page-desktop: '24px'
  page-mobile: '16px'
  section: '24px'
---

# 方屿工具箱设计约定

## 方向与依据

2026-10-31：视觉规范以同工作区 MapManager-frontend 的 DESIGN.md、NavBar、AsideMenuItem、SectionMain 为准。共享顶栏采用 36px Logo、18px/700 品牌名、12px 元素间距；隐藏英文装饰副标题与 eyebrow，保留现有产品名称及导航。菜单分组间距 24px，菜单文字 14px/500、图标 21px、横向内边距 12px、纵向 10px，移除额外分隔线与选中圆点；浅色选中为 #EFF7FF，深色为 25% 透明度的 #004C97。

面向 Minecraft 创作者的简体中文工具目录与文件工具。按本次用户指定的 [Flowbite Admin Dashboard](https://github.com/themesberg/flowbite-admin-dashboard) 重构：固定 64px 顶栏、256px 白色侧栏、浅灰工作区、带细边框与轻阴影的卡片。采用模板的 sidebar、navbar-dashboard、settings 表单和 Flowbite 组件配方，保留 React/Vite 架构。

这次系统级调整替代 `.skills/DESIGN.md` 的深蓝浮动侧栏与蓝青配色；其 Vue 路径不是本工具箱所有者。布局不添加模板中的虚构统计、搜索、账户或通知功能。

## Token 路径

采用运行时所有者模式：`tailwind.config.js` 是品牌蓝和 Slate 灰阶的唯一色值源，`src/index.css` 使用 PostCSS `theme()` 引用它，并维护语义、主题、滚动条变量；`src/App.css` 使用 Tailwind `@apply` 和这些变量组合共享组件。没有另一个导出主题。

- 主品牌蓝 `primary.700` #004C97；主操作悬停 `primary.800` #003B75；焦点 `primary.500` #3180E3；浅背景 #EFF7FF；柔和蓝 #D9ECFF；深色文字强调 #8AC2FF。
- 日落橙只用于投稿提示：文字 #B84700、背景 #FFEAD7；深色为 #FAB479 / #432B1D。不作为成功或危险色。
- 浅色工作台 #F8FAFC、表面 #FFFFFF、边框 #E2E8F0、标题 #0F172A、正文 #334155、辅助 #64748B。
- 深色工作台 #0F172A、表面 #1E293B、控件 #334155、文字 #E2E8F0、辅助 #94A3B8。
- 标准控件与卡片圆角 8px；按钮/输入高 44px；图标按钮 40px；复选框保持 18px，不继承文本输入框尺寸。
- 字体与 MapManager 一致，使用 Inter / -apple-system / BlinkMacSystemFont / Segoe UI / PingFang SC / Microsoft YaHei / sans-serif；标题 24px/700、卡片标题 18px、正文和控件 14px、辅助 12px；标识和密钥用系统等宽字体。不加载远程字体。

## 布局与组件

- `AppLayout` / `Sidebar` / `PageHeader` / `AppFooter` 是公共框架，`Card` / `Field` / `Button` / `Status` / `EmptyState` 是共享展示所有者。
- 侧栏依次为「概览：工具首页」「创作工具：地图管理平台（站外链接）、Schematic Cloud、二维码生成器」「素材资源：素材网站」。当前路由显示浅蓝背景、品牌蓝文字及 `aria-current`。
- 1024px 以下使用顶栏菜单按钮打开原生 modal dialog 导航，支持 Escape、原生焦点约束和焦点恢复，保留完整文字；抽屉与桌面侧栏同为 256px，紧贴左边缘，从 64px 顶栏下沿延伸到底。替代开发规范中旧图标栏方案。
- 主内容最大 1536px，内边距手机 16px、桌面 24px；自然文档滚动。卡片网格最小列宽 260px，窄屏单列。1100px 以下表单与结果按文档顺序单列。
- 表单采用 Flowbite 原生输入、复选框、select 样式；select 的展开菜单由操作系统负责，不承诺自定义弹层几何。
- 标签为 Flowbite 紧凑圆角 badge，内容与语义来自原数据；状态提示保持成功/失败文字和 live region。
- 品牌 Logo 在浅色主题保留原图，深色主题通过 CSS filter 将非透明部分显示为白色，保留透明轮廓。
- 深浅色选择保持 `voxisle-theme` 存储规则；默认跟随系统。滚动条全局可见，支持 forced-colors；动画尊重 reduced-motion。

## 业务边界与验证

`App.tsx` 的 hash 路由、`config.ts`、`lib`、工具和素材数据、QR 与蓝图页面的参数、状态、校验及请求保持原样。API 状态检查只在工具页面运行。站外链接仍在新标签页打开。每个路由的文档标题使用「页面 · 方屿工具箱」。

本次修改需执行 ESLint、TypeScript/Vite 构建、Premium 静态审计，并在浏览器检查全部路由、深浅色、窄屏导航、键盘、表单与文件交互。模拟接口验证与真实 API 联调分别报告。


## 共享组件交互统一（2026-10-31 深查）

与 MapManager 采用同一导航契约：桌面固定侧栏；1024px 以下抽屉覆盖内容，遮罩覆盖顶栏。标题区内边距 16px 20px，菜单区 20px 12px；打开焦点在关闭按钮，Tab/Shift+Tab 循环，Escape、遮罩、导航选项关闭菜单，切回桌面自动关闭。触发器同步 aria-expanded，关闭后原生 dialog 恢复焦点。

Field 通过显式 id 关联 label 与帮助说明，点击标签聚焦原输入；值、onChange 和原有校验不变。字段组间隔 20px，双列间距 24px，标签到控件 8px、帮助说明上间距 4px；没有帮助文案时不添加空白行。Button 复用现有 busy 状态提供 spinner、aria-busy 与禁用，图标占位稳定；主按钮仍为 44px、图标按钮 40px、焦点外偏移 2px。

操作结果仍展示在原表单上下文中：成功使用 status、失败使用 alert；不把可恢复错误移到会消失的 toast。原生 select 保留平台的 Arrow/Enter/Escape 行为。主题设置、上传参数、下载凭证、请求与错误处理不变。跨项目浏览器回归由 lorianmanager-fr/tests/design-interactions.cjs 覆盖。


输入与中性描边按钮的必要边界统一使用 Slate 500（浅色）/ Slate 400（深色），保留可辨识的控件轮廓；卡片装饰分隔线仍用 Slate 200/700。


## 隐藏验证入口（2026-11-01）

`/lcverify` 不进入菜单或首页卡片，使用共享 Card / Status 与现有 main 布局，显示发送中、已发送但结果待确认和网络失败。只读取 userName、verify，纯前端直接向飞书 POST JSON 文本（no-cors / text/plain）；不显示参数或原始响应，不自动重试。原有 hash 工具路由保持不变。
