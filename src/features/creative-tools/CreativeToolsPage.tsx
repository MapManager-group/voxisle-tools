import { AppLayout } from '../../components/layout/AppLayout'
import { ToolCatalog } from '../../components/ui/ToolCatalog'
import { creativeToolGroups } from './tools'

export function CreativeToolsPage() {
  return <AppLayout activeTool="creative-tools" eyebrow="CREATIVE TOOLS" title="创作工具" description="">
    <ToolCatalog groups={creativeToolGroups}/>
  </AppLayout>
}
