import type { ReactNode } from 'react'
import { QR_API, SCHEMATIC_API, type Tool } from '../../config'
import { AppFooter } from './AppFooter'
import { PageHeader } from './PageHeader'
import { Sidebar } from './Sidebar'

export function AppLayout({ activeTool, eyebrow, title, description, children }: { activeTool: Tool; eyebrow: string; title: string; description: string; children: ReactNode }) {
  const apiUrl = activeTool === 'qrcode' ? QR_API : activeTool === 'schematic' ? SCHEMATIC_API : undefined
  return <div className="app-shell"><Sidebar activeTool={activeTool}/><div className="content-shell"><main className="main"><PageHeader key={apiUrl} eyebrow={eyebrow} title={title} description={description} apiUrl={apiUrl}/>{children}<AppFooter/></main></div></div>
}
