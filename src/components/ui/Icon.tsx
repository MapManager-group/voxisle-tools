import type { ReactNode } from 'react'

export type IconName = 'qr' | 'cloud' | 'download' | 'upload' | 'copy' | 'check' | 'home' | 'image' | 'arrow' | 'external'

const paths: Record<IconName, ReactNode> = {
  home: <><path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m4 17 5-5 4 4 2-2 5 5"/></>,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6"/>,
  external: <><path d="M14 4h6v6m0-6L10 14"/><path d="M10 4H4v16h16v-6"/></>,
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
