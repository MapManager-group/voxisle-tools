import type { ReactNode } from 'react'

export type IconName = 'qr' | 'cloud' | 'download' | 'upload' | 'copy' | 'check'

const paths: Record<IconName, ReactNode> = {
  qr: <><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z"/><path d="M14 14h2v2h-2zM18 14h2v4h-2zM14 18h4v2h-4z"/></>,
  cloud: <path d="M7 18a5 5 0 0 1-.4-10A7 7 0 0 1 20 10.5 3.8 3.8 0 0 1 19 18H7Z"/>,
  download: <><path d="M12 3v12m-4-4 4 4 4-4"/><path d="M5 20h14"/></>,
  upload: <><path d="M12 16V4m-4 4 4-4 4 4"/><path d="M5 20h14"/></>,
  copy: <><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
}

export function Icon({ name }: { name: IconName }) {
  return <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}
