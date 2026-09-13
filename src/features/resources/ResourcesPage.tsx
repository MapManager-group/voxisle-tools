import { AppLayout } from '../../components/layout/AppLayout'
import { Card } from '../../components/ui'
import { Icon } from '../../components/ui/Icon'
import { resources } from './resources'

export function ResourcesPage() {
  return <AppLayout activeTool="resources" eyebrow="VOXISLE RESOURCES" title="素材网站" description="集中浏览蓝图、图片、插图与设计灵感网站；所有链接将在新标签页打开。">
    <div className="tool-grid">
      {resources.map((resource) => <Card key={resource.href} title={resource.name} description={resource.description} className="tool-card">
        <a className="button button-secondary button-wide" href={resource.href} target="_blank" rel="noopener noreferrer" aria-label={`访问${resource.name}（新标签页）`}>
          访问网站<Icon name="external"/>
        </a>
      </Card>)}
    </div>
  </AppLayout>
}
