import { Icon } from '../../components/ui/Icon'

export function Credential({ label, value, sensitive, onCopy }: { label: string; value: string; sensitive?: boolean; onCopy: () => void }) {
  return <div className={`credential ${sensitive ? 'is-sensitive' : ''}`}><div><span>{label}</span><code>{value}</code></div><button className="icon-button" onClick={onCopy} type="button" aria-label={`复制${label}`} title={`复制${label}`}><Icon name="copy"/></button></div>
}
