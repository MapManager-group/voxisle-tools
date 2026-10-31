import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Icon, type IconName } from './Icon'

export type Notice = { tone: 'success' | 'error'; text: string } | null
export type TagTone = 'blue' | 'cyan' | 'green' | 'amber' | 'purple' | 'rose' | 'slate'

export function Card({ title, description, tags, children, className = '' }: { title: string; description?: string; tags?: [label: string, tone: TagTone][]; children: ReactNode; className?: string }) {
  return <section className={`card ${className}`}><header className="card-header"><h2>{title}</h2>{description && <p>{description}</p>}{tags?.length && <div className="tag-list" aria-label="标签">{tags.map(([label, tone]) => <span className={`tag tag-${tone}`} key={`${label}-${tone}`}>{label}</span>)}</div>}</header>{children}</section>
}

export function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: ReactNode }) {
  return <div className="field"><label className="field-label" htmlFor={id}>{label}</label>{children}{hint && <div className="field-help" id={`${id}-help`}>{hint}</div>}</div>
}

export function Status({ notice }: { notice: Notice }) {
  return notice && <div className={`notice notice-${notice.tone}`} role={notice.tone === 'error' ? 'alert' : 'status'}>{notice.text}</div>
}

export function Button({ icon, tone = 'primary', wide = true, busy = false, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { icon: IconName; tone?: 'primary' | 'secondary'; wide?: boolean; busy?: boolean }) {
  return <button type="submit" {...props} disabled={busy || props.disabled} aria-busy={busy || undefined} className={`button button-${tone}${wide ? ' button-wide' : ''}`}><span className="button-icon">{busy ? <span className="button-spinner" aria-hidden="true"/> : <Icon name={icon}/>}</span>{children}</button>
}

export function EmptyState({ icon, title, text }: { icon: IconName; title: string; text: string }) {
  return <div className="empty"><span className="empty-icon"><Icon name={icon}/></span><strong>{title}</strong><span>{text}</span></div>
}
