import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AppLayout } from '../../components/layout/AppLayout'
import { Button, Card, EmptyState, Field, Status, type Notice } from '../../components/ui'
import { Icon } from '../../components/ui/Icon'
import { QR_API } from '../../config'
import { readApiError } from '../../lib/api'

export function QrCodePage() {
  const [url, setUrl] = useState('https://www.voxisle.art')
  const [format, setFormat] = useState<'svg' | 'png'>('svg')
  const [size, setSize] = useState(1024), [border, setBorder] = useState(4), [centerRatio, setCenterRatio] = useState(.333)
  const [color, setColor] = useState('#004C97')
  const [result, setResult] = useState<{ url: string; name: string; ratio: string } | null>(null)
  const [notice, setNotice] = useState<Notice>(null), [busy, setBusy] = useState(false)
  const urlRef = useRef<HTMLInputElement>(null)

  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url) }, [result])

  async function generate(event: FormEvent) {
    event.preventDefault(); setNotice(null)
    try {
      const parsed = new URL(url)
      if (!['http:', 'https:'].includes(parsed.protocol) || /\s/.test(url)) throw new Error()
    } catch { setNotice({ tone: 'error', text: '请输入完整且不含空格的 http:// 或 https:// 链接。' }); urlRef.current?.focus(); return }
    if (size < 256 || size > 16384 || border < 4 || border > 32 || !/^#[0-9a-f]{6}$/i.test(color) || (centerRatio !== 0 && (centerRatio < .12 || centerRatio > .36))) {
      setNotice({ tone: 'error', text: '请检查尺寸、静区、中心比例和颜色是否在允许范围内。' }); return
    }
    setBusy(true)
    try {
      const response = await fetch(`${QR_API}/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url, format, size, border, center_ratio: centerRatio, color }) })
      if (!response.ok) throw new Error(await readApiError(response, `生成失败（${response.status}）`))
      const blobUrl = URL.createObjectURL(await response.blob())
      setResult((current) => { if (current) URL.revokeObjectURL(current.url); return { url: blobUrl, name: `qrcode.${format}`, ratio: response.headers.get('X-Center-Ratio') ?? String(centerRatio) } })
      setNotice({ tone: 'success', text: '二维码已生成，可以预览或下载。' })
    } catch (error) { setNotice({ tone: 'error', text: `${error instanceof Error ? error.message : '生成失败'} 请检查网络或稍后重试。` }) }
    finally { setBusy(false) }
  }

  return <AppLayout activeTool="qrcode" eyebrow="QR CODE MAKER" title="二维码生成器" description="将链接生成带方屿标识的透明二维码，适合网页、海报和印刷物。"><div className="workspace-grid">
    <Card title="生成设置" description="填写链接并调整输出参数。"><form noValidate onSubmit={generate}>
      <Field label="目标链接" hint="必须以 http:// 或 https:// 开头"><input ref={urlRef} value={url} onChange={(e) => setUrl(e.target.value)} inputMode="url" aria-label="目标链接"/></Field>
      <div className="field-row"><Field label="文件格式"><select value={format} onChange={(e) => setFormat(e.target.value as 'svg' | 'png')} aria-label="文件格式"><option value="svg">SVG · 矢量</option><option value="png">PNG · 位图</option></select></Field><Field label="输出尺寸" hint="256–16384 px"><input type="number" min="256" max="16384" value={size} onChange={(e) => setSize(Number(e.target.value))} aria-label="输出尺寸"/></Field></div>
      <div className="field-row"><Field label="静区宽度" hint="4–32 个模块"><input type="number" min="4" max="32" value={border} onChange={(e) => setBorder(Number(e.target.value))} aria-label="静区宽度"/></Field><Field label="中心标识比例" hint="0 隐藏标识，或 0.12–0.36"><input type="number" min="0" max=".36" step=".001" value={centerRatio} onChange={(e) => setCenterRatio(Number(e.target.value))} aria-label="中心标识比例"/></Field></div>
      <Field label="二维码颜色" hint="建议使用较深颜色以确保识别"><div className="color-control"><input type="color" value={color} onChange={(e) => setColor(e.target.value.toUpperCase())} aria-label="选择二维码颜色"/><input value={color} onChange={(e) => setColor(e.target.value)} aria-label="二维码颜色值"/></div></Field>
      <Status notice={notice}/><Button icon="qr" disabled={busy}>{busy ? '正在生成…' : '生成二维码'}</Button>
    </form></Card>
    <Card title="实时结果" description="生成后在这里检查图像并下载。" className="preview-card"><div className={`qr-preview ${result ? 'has-result' : ''}`}>{result ? <img src={result.url} alt="生成的二维码预览"/> : <EmptyState icon="qr" title="等待生成" text="完成左侧设置后生成二维码"/>}</div><div className="preview-meta"><span>H 级纠错</span><span>透明背景</span>{result && <span>中心比例 {result.ratio}</span>}</div>{result && <a className="button button-secondary button-wide" href={result.url} download={result.name}><Icon name="download"/>下载 {result.name.toUpperCase()}</a>}</Card>
  </div></AppLayout>
}
