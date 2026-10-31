import type {TagTone} from '../../components/ui'

export type ToolCard = { name: string; description: string; href: string; tags: [label: string, tone: TagTone][] }

export const toolGroups: { name: string; description: string; tools: ToolCard[] }[] = [
    {
        name: '洛林·方屿VoxIsle 社区指南',
        description: '',
        tools: [
            {
                name: '常见问题指南',
                description: '方屿大多数问题都可以在这里解决。',
                href: 'https://lorianstudio.feishu.cn/wiki/TEsXwURzOirxNPkLvanc5N8InEg',
                tags: [['方屿', 'blue']]
            },
            {
                name: '命令指南',
                description: '在这里可以查询服务器可用命令。',
                href: 'https://lorianstudio.feishu.cn/wiki/H1erwjnOwiIpWzkyxJecS0VGnud',
                tags: [['方屿', 'blue']]
            },
            {
                name: '服务器更新日志',
                description: '查询各个子服的更新日志。',
                href: 'https://lorianstudio.feishu.cn/wiki/ETPVwapeUisDEVktaNfcXXgQnGg',
                tags: [['方屿', 'blue']]
            },
        ],
    },
    {
        name: '生成器',
        description: '生成二维码、像素画、粒子指令与动态视觉内容。',
        tools: [
            {
                name: '二维码生成器',
                description: '将链接生成带方屿标识的透明二维码，支持调整尺寸与配色，下载后用于网页、海报或印刷物。',
                href: '#qrcode',
                tags: [['方屿', 'blue'], ['二维码', 'cyan'], ['站内工具', 'green']]
            },
            {
                name: 'BDEngine',
                description: '通过可视化页面，使用mc中的元素创建mc中的展示实体。',
                href: 'https://bdengine.app',
                tags: [['3D', 'purple'], ['实体', 'cyan'], ['在线生成', 'green']]
            },
            {
                name: '玻璃像素画生成器',
                description: '将图片转换为由 Minecraft 彩色玻璃构成的像素画，并提供可调整的生成参数与搭建参考。',
                href: 'https://imhols.github.io/minecraft-glasspixel-generator/',
                tags: [['Minecraft', 'green'], ['像素画', 'purple'], ['图片', 'blue']]
            },
            {
                name: 'Spritecraft 像素画生成器',
                description: '将图片转换为 Minecraft 方块像素画，并生成可供搭建参考的方块效果。',
                href: 'https://autosaved.org/spritecraft',
                tags: [['Minecraft', 'green'], ['像素画', 'purple'], ['图片', 'blue']]
            },
            {
                name: 'Minecraft 粒子指令生成器',
                description: '通过可视化参数生成 Minecraft 粒子效果指令，减少手动编写成本。',
                href: 'https://mc.ecylt.top/',
                tags: [['Minecraft', 'green'], ['指令', 'amber'], ['在线生成', 'cyan']]
            },
            {
                name: 'Space Type Generator',
                description: '提供多种可实时编辑的 3D 动态文字效果，可调整样式、模式与显示文字。',
                href: 'https://spacetypegenerator.com/',
                tags: [['3D', 'purple'], ['动态效果', 'rose'], ['文字', 'blue']]
            },
            {
                name: 'PhotoMosh',
                description: '上传图片并叠加多种故障艺术特效，支持导出多种格式图片。',
                href: 'https://photomosh.com/app/',
                tags: [['图片', 'blue'], ['故障艺术', 'rose'], ['多格式', 'amber']]
            },
            {
                name: 'Panzoid',
                description: '使用社区动画模板制作片头，在 Clipmaker 中编辑多层文字、字体和动画效果。',
                href: 'https://panzoid.com/',
                tags: [['视频', 'rose'], ['动画模板', 'purple'], ['片头', 'blue']]
            },
            {
                name: 'Blobmixer',
                description: '在线制作水滴、液态金属、螺旋体等可切换的 3D 动态形态。',
                href: 'https://blobmixer.14islands.com/',
                tags: [['3D', 'purple'], ['动态效果', 'rose'], ['免费', 'green']]
            },
            {
                name: 'NameChef',
                description: '按中文名、英文名、谐音与寓意等方向生成命名灵感。',
                href: 'https://www.namechef.co/cn',
                tags: [['命名', 'purple'], ['中文', 'rose'], ['英文', 'blue']]
            },
        ],
    },
    {
        name: '配色工具',
        description: '查找渐变、传统色与 Minecraft 方块配色。',
        tools: [
            {
                name: 'hueBlocks 配色工具',
                description: '按颜色生成 Minecraft 方块渐变，帮助建筑选材和规划色彩过渡。',
                href: 'https://1280px.github.io/hueblocks/',
                tags: [['Minecraft', 'green'], ['渐变', 'purple'], ['不定期失效', 'amber']]
            },
            {
                name: 'WebGradients',
                description: '浏览并复制现成的渐变配色，适合网页、海报和视觉设计。',
                href: 'https://webgradients.com/',
                tags: [['渐变', 'purple'], ['配色', 'blue'], ['网页设计', 'cyan']]
            },
            {
                name: 'Color Hunt',
                description: '持续更新的配色方案社区，提供热门排行与近期配色浏览。',
                href: 'https://colorhunt.co/',
                tags: [['配色', 'blue'], ['更新频繁', 'green'], ['排行榜', 'amber']]
            },
            {
                name: 'Adobe Color',
                description: '创建和探索其他用户分享的配色盘，并使用多种色彩规则辅助搭配。',
                href: 'https://color.adobe.com/',
                tags: [['配色', 'blue'], ['用户作品', 'purple'], ['色彩规则', 'cyan']]
            },
            {
                name: 'NIPPON COLORS',
                description: '收录具有名称与出处的日本传统色，可直观浏览色值和色彩关系。',
                href: 'https://nipponcolors.com/',
                tags: [['日系', 'rose'], ['传统色', 'amber'], ['颜色名称', 'slate']]
            },
            {
                name: '中国色',
                description: '浏览带有传统名称的中国色彩，快速获取色值与配色灵感。',
                href: 'http://zhongguose.com/',
                tags: [['中系', 'rose'], ['传统色', 'amber'], ['颜色名称', 'slate']]
            },
        ],
    },
    {
        name: '转换工具',
        description: '处理地图、模型、Schematic 与图片视频文件。',
        tools: [
            {
                name: 'Schematic Cloud',
                description: '上传并分享 schematic/schem 文件，可以在方屿使用。',
                href: '#schematic',
                tags: [['Minecraft', 'green'], ['Schematic', 'purple'], ['站内工具', 'blue']]
            },
            {
                name: 'Chunker',
                description: '在 Java 版与基岩版之间转换 Minecraft 世界，方便迁移地图。',
                href: 'https://www.chunker.app',
                tags: [['Minecraft', 'green'], ['世界转换', 'purple'], ['Java / 基岩版', 'amber']]
            },
            {
                name: 'MCA Selector',
                description: '查看、筛选并删除 Minecraft Java 版世界区块，适合地图清理和区块管理。',
                href: 'https://github.com/Querz/mcaselector',
                tags: [['Minecraft', 'green'], ['区块编辑', 'amber'], ['开源', 'slate']]
            },
            {
                name: 'obj2schematic',
                description: '将 OBJ 三维模型转换为 Minecraft schematic 文件。',
                href: 'https://objtoschematic.com/',
                tags: [['Minecraft', 'green'], ['OBJ', 'cyan'], ['Schematic', 'purple']]
            },
            {
                name: '即时工具',
                description: '集合图片切割、拼图及视频处理等多种在线实用工具。',
                href: 'https://www.67tool.com/',
                tags: [['图片', 'blue'], ['视频', 'rose'], ['工具合集', 'slate']]
            },
        ],
    },
]
