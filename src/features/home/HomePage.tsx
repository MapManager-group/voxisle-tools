import { AppLayout } from '../../components/layout/AppLayout'
import { ToolCatalog } from '../../components/ui/ToolCatalog'
import { toolGroups } from './tools'

export function HomePage() {
  return <AppLayout activeTool="home" eyebrow="VOXISLE TOOLS" title="工具首页" description="查看方屿服务器工具与社区指南，前往创作工具和素材网站。">
    <ToolCatalog groups={toolGroups}/>
  </AppLayout>
}
