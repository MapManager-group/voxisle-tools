import { useEffect, useState } from 'react'

export function PageHeader({ eyebrow, title, description, apiUrl }: { eyebrow: string; title: string; description: string; apiUrl?: string }) {
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null)

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

  return <header className="page-header"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{apiUrl && <span className={`service-status service-status-${status}`} role="status" aria-label={statusText} title={statusText}><i aria-hidden="true"/>{statusText}</span>}</header>
}
