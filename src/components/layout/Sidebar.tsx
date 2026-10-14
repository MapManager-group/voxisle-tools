import type { RefObject } from 'react'
import type { Tool } from '../../config'
import { Icon, type IconName } from '../ui/Icon'

const groups: { title: string; items: { tool: Tool; label: string; icon: IconName }[] }[] = [
  { title: '概览', items: [{ tool: 'home', label: '工具首页', icon: 'home' }] },
  { title: '创作工具', items: [
    { tool: 'schematic', label: 'Schematic Cloud', icon: 'cloud' },
    { tool: 'qrcode', label: '二维码生成器', icon: 'qr' },
  ] },
  { title: '素材资源', items: [{ tool: 'resources', label: '素材网站', icon: 'image' }] },
]

export function Sidebar({ activeTool, menuRef }: { activeTool: Tool; menuRef: RefObject<HTMLDialogElement | null> }) {
  const menu = <>
    <nav aria-label="主导航" className="sidebar-nav">
      {groups.map(group => <section className="nav-group" key={group.title}>
        <h2>{group.title}</h2>
        <ul>{group.items.map(item => <li key={item.tool}>
          <a href={`#${item.tool}`} className={activeTool === item.tool ? 'active' : ''} aria-current={activeTool === item.tool ? 'page' : undefined} onClick={() => menuRef.current?.close()}>
            <Icon name={item.icon}/><span>{item.label}</span>{activeTool === item.tool && <span className="nav-current" aria-hidden="true"/>}
          </a>
        </li>)}</ul>
      </section>)}
    </nav>
    <div className="sidebar-foot"><Icon name="check"/><span>文件由 Voxisle API 处理<small>请勿上传敏感内容</small></span></div>
  </>
  return <>
    <aside className="sidebar" aria-label="侧边菜单">{menu}</aside>
    <dialog ref={menuRef} className="mobile-menu" aria-labelledby="menu-title">
      <div className="mobile-menu-heading"><strong id="menu-title">工具导航</strong><button type="button" className="icon-button" aria-label="关闭导航菜单" onClick={() => menuRef.current?.close()}><Icon name="close"/></button></div>
      {menu}
    </dialog>
  </>
}
