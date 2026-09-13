import { useEffect, useState } from 'react'
import { Icon } from '../ui/Icon'

export function PageHeader({ eyebrow, title, description, apiUrl }: { eyebrow: string; title: string; description: string; apiUrl?: string }) {
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

  return <header className="page-header"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div><div className="page-header-actions">{apiUrl && <span className={`service-status service-status-${status}`} role="status" aria-label={statusText} title={statusText}><i aria-hidden="true"/>{statusText}</span>}<button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={themeLabel} title={themeLabel}><Icon name={theme === 'dark' ? 'sun' : 'moon'}/></button></div></header>
}
