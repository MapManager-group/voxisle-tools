type ToolCard = {
    name: string
    description: string
    href: string
}

// 手动添加工具：填写 name、description、href 即可。
// 站内链接使用 #qrcode / #schematic；外部链接使用完整 https:// 地址。
// href 留空时显示为待添加卡片，按钮不可点击；不需要的预留项可以直接删除。
export const tools: ToolCard[] = [
    {
        name: '二维码生成器',
        description: '将链接生成带方屿标识的透明二维码，支持调整尺寸与配色，下载后用于网页、海报或印刷物。',
        href: '#qrcode',
    },
    {
        name: 'Schematic Cloud',
        description: '上传并分享 schematic/schem文件，在方屿使用。',
        href: '#schematic',
    },
    {
        name: 'Chunker',
        description: '开源 Minecraft 世界转换工具，用于 Java 版与基岩版之间的世界转换，方便迁移地图。',
        href: 'https://www.chunker.app',
    },
    {
        name: 'hueblocks 配色工具',
        description: '选择颜色或方块，生成 Minecraft 方块渐变配色，帮助建筑选材、搭配墙面与规划色彩过渡。',
        href: 'https://1280px.github.io/hueblocks/',
    },
    {
        name: 'obj2schematic',
        description: 'obj转schem工具',
        href: 'https://objtoschematic.com/'
    },
    {name: '', description: '', href: ''},
    {name: '', description: '', href: ''},
    {name: '', description: '', href: ''},
    {name: '', description: '', href: ''},
    {name: '', description: '', href: ''},
    {name: '', description: '', href: ''},
]
