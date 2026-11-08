import { AppLayout } from '../../components/layout/AppLayout'
import { ToolCatalog } from '../../components/ui/ToolCatalog'
import { toolGroups } from './tools'

export function HomePage() {
  return <AppLayout activeTool="home" eyebrow="VOXISLE TOOLS" title="工具首页" description="">
    <ToolCatalog groups={toolGroups}/>
    <p className="mt-4 text-xs leading-6 text-gray-500 dark:text-gray-400" role="note" aria-label="站外链接免责声明">站外链接仅供参考，相关内容与服务由对应网站提供。请自行甄别，并注意个人信息安全。</p>
  </AppLayout>
}
