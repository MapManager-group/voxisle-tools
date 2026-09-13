import { AppLayout } from '../../components/layout/AppLayout'
import { Card } from '../../components/ui'
import { Icon } from '../../components/ui/Icon'
import { toolGroups } from './tools'

export function HomePage() {
  return <AppLayout activeTool="home" eyebrow="VOXISLE TOOLS" title="工具首页" description="从建筑蓝图、世界转换到方块配色，找到下一次创作需要的工具。">
    <div className="catalog-sections">
      {toolGroups.map((group) => <section className="catalog-section" key={group.name}>
        <header className="section-header"><h2>{group.name}</h2><p>{group.description}</p></header>
        <div className="tool-grid">
      {group.tools.map((tool) => {
        const external = /^https?:\/\//i.test(tool.href)
        return <Card key={tool.href} title={tool.name} description={tool.description} tags={tool.tags} className="tool-card">
          <a className="button button-secondary button-wide" href={tool.href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} aria-label={`${external ? '访问' : '打开'}${tool.name}${external ? '（新标签页）' : ''}`}>
            {external ? '访问网站' : '打开工具'}<Icon name={external ? 'external' : 'arrow'}/>
          </a>
        </Card>
      })}</div></section>)}
      <aside className="catalog-contact" aria-label="投稿方式">有好用的工具？欢迎投稿至 <a href="mailto:contact@lorian.cn">contact@lorian.cn</a></aside>
    </div>
  </AppLayout>
}
