import { useEffect, type RefObject } from 'react'
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

export function Sidebar({ activeTool, menuRef, onOpenChange }: { activeTool: Tool; menuRef: RefObject<HTMLDialogElement | null>; onOpenChange: (open: boolean) => void }) {
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)')
    const closeOnDesktop = () => { if (desktop.matches) menuRef.current?.close() }
    desktop.addEventListener('change', closeOnDesktop)
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [menuRef])
  const menu = <>
    <nav aria-label="主导航" className="sidebar-nav">
      {groups.map(group => <section className="nav-group" key={group.title}>
        <h2>{group.title}</h2>
        <ul>{group.items.map(item => <li key={item.tool}>
          <a href={`#${item.tool}`} className={activeTool === item.tool ? 'active' : ''} aria-current={activeTool === item.tool ? 'page' : undefined} onClick={() => menuRef.current?.close()}>
            <Icon name={item.icon}/><span>{item.label}</span>
          </a>
        </li>)}</ul>
      </section>)}
    </nav>
    <div className="sidebar-foot"><Icon name="check"/><span>文件由 Voxisle API 处理<small>请勿上传敏感内容</small></span></div>
  </>
  return <>
    <aside className="sidebar" aria-label="侧边菜单">{menu}</aside>
    <dialog ref={menuRef} id="primary-navigation" className="mobile-menu" aria-labelledby="menu-title" onToggle={event => onOpenChange(event.currentTarget.open)} onClick={event => { if (event.target === event.currentTarget) menuRef.current?.close() }} onKeyDown={event => {
      if (event.key !== 'Tab') return
      const controls = event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)')
      const first = controls[0], last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }}>
      <div className="mobile-menu-heading"><strong id="menu-title">导航菜单</strong><button type="button" className="icon-button" aria-label="关闭导航菜单" onClick={() => menuRef.current?.close()}><Icon name="close"/></button></div>
      {menu}
    </dialog>
  </>
}
