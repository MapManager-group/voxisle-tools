import type { ToolGroup } from '../../components/ui/ToolCatalog'

export const toolGroups: ToolGroup[] = [
    {
        name: '服务器工具',
        description: '',
        tools: [
            {
                name: '地图管理平台',
                description: '管理和申请托管服地图。',
                href: 'https://map.voxisle.art',
                tags: [['方屿', 'blue']]
            },
            {
                name: 'Schematic Cloud',
                description: '上传并分享 schematic/schem 文件，可以在方屿使用。',
                href: '#schematic',
                tags: [['Schematic', 'purple'], ['方屿', 'blue']]
            },
            {
                name: '洛林 · 世界 Lorian City 专区',
                description: '大世界玩法常用工具。',
                href: '#lorian-city',
                tags: [['洛林·世界', 'green'], ['方屿', 'blue']]
            },
        ],
    },
    {
        name: '社区和服务器指南',
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
        name: '工具与资源',
        description: '',
        tools: [
            {
                name: '创作工具',
                description: '浏览生成器、配色工具和转换工具。',
                href: '#creative-tools',
                tags: [['工具合集', 'blue']]
            },
            {
                name: '素材网站',
                description: '查找蓝图、图片、插图与设计灵感。',
                href: '#resources',
                tags: [['素材资源', 'purple']]
            },
        ],
    },
]
