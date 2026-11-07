import { Card, type TagTone } from './index'
import { Icon } from './Icon'

export type ToolCard = { name: string; description: string; href: string; tags: [label: string, tone: TagTone][] }
export type ToolGroup = { name: string; description: string; tools: ToolCard[] }

export function ToolCatalog({ groups }: { groups: ToolGroup[] }) {
  return (
    <div className="catalog-sections">
      {groups.map((group) => <section className="catalog-section" key={group.name}>
        <header className="section-header"><div className="section-title"><h2>{group.name}</h2><span className="section-count" aria-label={`${group.tools.length} 个工具`}>{group.tools.length}</span></div>{group.description && <p>{group.description}</p>}</header>
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
  )
}
