import type { ReactNode } from 'react'
import type { Tool } from '../../config'
import { AppFooter } from './AppFooter'
import { PageHeader } from './PageHeader'
import { Sidebar } from './Sidebar'

export function AppLayout({ activeTool, eyebrow, title, description, children }: { activeTool: Tool; eyebrow: string; title: string; description: string; children: ReactNode }) {
  return <div className="app-shell"><Sidebar activeTool={activeTool}/><div className="content-shell"><main className="main"><PageHeader eyebrow={eyebrow} title={title} description={description}/>{children}<AppFooter/></main></div></div>
}
