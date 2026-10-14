import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Icon, type IconName } from './Icon'

export type Notice = { tone: 'success' | 'error'; text: string } | null
export type TagTone = 'blue' | 'cyan' | 'green' | 'amber' | 'purple' | 'rose' | 'slate'

export function Card({ title, description, tags, children, className = '' }: { title: string; description?: string; tags?: [label: string, tone: TagTone][]; children: ReactNode; className?: string }) {
  return <section className={`card ${className}`}><header className="card-header"><h2>{title}</h2>{description && <p>{description}</p>}{tags?.length && <div className="tag-list" aria-label="标签">{tags.map(([label, tone]) => <span className={`tag tag-${tone}`} key={`${label}-${tone}`}>{label}</span>)}</div>}</header>{children}</section>
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return <div className="field"><div className="field-label">{label}</div>{children}<div className="field-help">{hint ?? '\u00a0'}</div></div>
}

export function Status({ notice }: { notice: Notice }) {
  return notice && <div className={`notice notice-${notice.tone}`} role={notice.tone === 'error' ? 'alert' : 'status'}>{notice.text}</div>
}

export function Button({ icon, tone = 'primary', wide = true, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { icon: IconName; tone?: 'primary' | 'secondary'; wide?: boolean }) {
  return <button type="submit" {...props} className={`button button-${tone}${wide ? ' button-wide' : ''}`}><Icon name={icon}/>{children}</button>
}

export function EmptyState({ icon, title, text }: { icon: IconName; title: string; text: string }) {
  return <div className="empty"><span className="empty-icon"><Icon name={icon}/></span><strong>{title}</strong><span>{text}</span></div>
}
