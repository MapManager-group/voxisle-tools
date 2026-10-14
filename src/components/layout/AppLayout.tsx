import { useEffect, useRef, type ReactNode } from 'react'
import { QR_API, SCHEMATIC_API, type Tool } from '../../config'
import { AppFooter } from './AppFooter'
import { PageHeader } from './PageHeader'
import { Sidebar } from './Sidebar'

export function AppLayout({ activeTool, eyebrow, title, description, children }: { activeTool: Tool; eyebrow: string; title: string; description: string; children: ReactNode }) {
  const menuRef = useRef<HTMLDialogElement>(null)
  const apiUrl = activeTool === 'qrcode' ? QR_API : activeTool === 'schematic' ? SCHEMATIC_API : undefined
  useEffect(() => { document.title = `${title} · 方屿工具箱` }, [title])
  return <div className="app-shell">
    <a className="skip-link" href="#main-content" onClick={(event) => { event.preventDefault(); document.getElementById('main-content')?.focus() }}>跳至主要内容</a>
    <Sidebar activeTool={activeTool} menuRef={menuRef}/>
    <div className="content-shell"><main className="main" id="main-content" tabIndex={-1}>
      <PageHeader key={apiUrl} eyebrow={eyebrow} title={title} description={description} apiUrl={apiUrl} onOpenMenu={() => menuRef.current?.showModal()}/>
      {children}<AppFooter/>
    </main></div>
  </div>
}
