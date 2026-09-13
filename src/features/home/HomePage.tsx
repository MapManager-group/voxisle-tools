import { AppLayout } from '../../components/layout/AppLayout'
import { Button, Card } from '../../components/ui'
import { Icon } from '../../components/ui/Icon'
import { tools } from './tools'

export function HomePage() {
  return <AppLayout activeTool="home" eyebrow="VOXISLE TOOLS" title="工具首页" description="从建筑蓝图、世界转换到方块配色，找到下一次创作需要的工具。">
    <div className="tool-grid">
      {tools.map((tool, index) => {
        const external = /^https?:\/\//i.test(tool.href)
        return <Card key={index} title={tool.name || '待添加工具'} description={tool.description || '更多实用工具，陆续收录。'} className={`tool-card${tool.href ? '' : ' tool-card-placeholder'}`}>
          {tool.href ? <a className="button button-secondary button-wide" href={tool.href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} aria-label={`${external ? '访问' : '打开'}${tool.name}${external ? '（新标签页）' : ''}`}>
            {external ? '访问网站' : '打开工具'}<Icon name={external ? 'external' : 'arrow'}/>
          </a> : <Button icon="arrow" tone="secondary" disabled>待添加</Button>}
        </Card>
      })}
    </div>
  </AppLayout>
}
