import { AppLayout } from '../../components/layout/AppLayout'
import { ToolCatalog } from '../../components/ui/ToolCatalog'
import { creativeToolGroups } from './tools'

export function CreativeToolsPage() {
  return <AppLayout activeTool="creative-tools" eyebrow="CREATIVE TOOLS" title="创作工具" description="浏览生成器、配色工具和转换工具，找到创作需要的工具。">
    <ToolCatalog groups={creativeToolGroups}/>
  </AppLayout>
}
