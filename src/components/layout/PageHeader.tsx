import { useEffect, useState } from 'react'
import { Icon } from '../ui/Icon'
import { Brand } from './Brand'

export function PageHeader({ eyebrow, title, description, apiUrl, menuOpen, onOpenMenu }: { eyebrow: string; title: string; description: string; apiUrl?: string; menuOpen: boolean; onOpenMenu: () => void }) {
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

  useEffect(() => {
    if (!apiUrl) return
    const controller = new AbortController()
    fetch(apiUrl, { signal: controller.signal })
      .then(response => setApiAvailable(response.status < 500))
      .catch(error => {
        if (error instanceof Error && error.name !== 'AbortError') setApiAvailable(false)
      })
    return () => controller.abort()
  }, [apiUrl])

  const status = apiAvailable === null ? 'checking' : apiAvailable ? 'available' : 'unavailable'
  const statusText = apiAvailable === null ? 'API 服务检查中' : apiAvailable ? 'API 服务正常' : 'API 服务异常'
  const nextTheme = theme === 'dark' ? 'light' : 'dark'
  const themeLabel = `切换到${nextTheme === 'dark' ? '深色' : '浅色'}模式`

  const toggleTheme = () => {
    document.documentElement.dataset.theme = nextTheme
    try { localStorage.setItem('voxisle-theme', nextTheme) } catch { /* The current page can still switch themes. */ }
    setTheme(nextTheme)
  }

  return <>
    <header className="topbar">
      <div className="topbar-brand"><button type="button" className="icon-button menu-toggle" aria-label="打开导航菜单" aria-haspopup="dialog" aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={onOpenMenu}><Icon name="menu"/></button><Brand/></div>
      <div className="topbar-context"><span className="topbar-divider"/>Minecraft 创作与实用工具</div>
      <div className="page-header-actions">{apiUrl && <span className={`service-status service-status-${status}`} role="status" aria-label={statusText} title={statusText}><i aria-hidden="true"/><span>{statusText}</span></span>}<button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={themeLabel} title={themeLabel}><Icon name={theme === 'dark' ? 'sun' : 'moon'}/></button></div>
    </header>
    <header className="page-header">
      <nav className="breadcrumb" aria-label="面包屑"><a href="#home"><Icon name="home"/>工具箱</a><span aria-hidden="true">/</span><span aria-current="page">{title}</span></nav>
      <div className="page-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div></div>
    </header>
  </>
}
