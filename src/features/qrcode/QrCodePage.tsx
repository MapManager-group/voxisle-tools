import { useEffect, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from 'react'
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
  const [logoEnabled, setLogoEnabled] = useState(true), [logoFile, setLogoFile] = useState<File | null>(null)
  const [frameEnabled, setFrameEnabled] = useState(true), [frameShape, setFrameShape] = useState<'rounded' | 'square'>('rounded')
  const [logoError, setLogoError] = useState(''), [dragging, setDragging] = useState(false), [checkingLogo, setCheckingLogo] = useState(false)
  const [result, setResult] = useState<{ url: string; name: string; ratio: string } | null>(null)
  const [notice, setNotice] = useState<Notice>(null), [busy, setBusy] = useState(false)
  const urlRef = useRef<HTMLInputElement>(null), logoRef = useRef<HTMLInputElement>(null)

  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url) }, [result])

  async function chooseLogo(file?: File) {
    if (!file) return
    const error = file.size === 0 || file.size > 1048576 || !['image/png', 'image/jpeg', 'image/webp'].includes(file.type)
      ? '请选择不超过 1 MiB 的 PNG、JPEG 或 WebP 图片。' : ''
    if (error) { setLogoError(error); if (logoRef.current) logoRef.current.value = ''; return }
    setCheckingLogo(true)
    try {
      const bitmap = await createImageBitmap(file)
      const valid = bitmap.width <= 2048 && bitmap.height <= 2048
      bitmap.close()
      if (!valid) throw new Error('图片宽高均不能超过 2048 像素。')
      setLogoFile(file); setLogoError('')
    } catch (error) { setLogoError(error instanceof Error && error.message === '图片宽高均不能超过 2048 像素。' ? error.message : '无法读取图片，请选择有效的 PNG、JPEG 或 WebP 图片。'); if (logoRef.current) logoRef.current.value = '' }
    finally { setCheckingLogo(false) }
  }

  async function generate(event: FormEvent) {
    event.preventDefault(); setNotice(null)
    try {
      const parsed = new URL(url)
      if (!['http:', 'https:'].includes(parsed.protocol) || /\s/.test(url)) throw new Error()
    } catch { setNotice({ tone: 'error', text: '请输入完整且不含空格的 http:// 或 https:// 链接。' }); urlRef.current?.focus(); return }
    if (size < 256 || size > 16384 || border < 4 || border > 32 || !/^#[0-9a-f]{6}$/i.test(color) || (centerRatio !== 0 && (centerRatio < .12 || centerRatio > .36))) {
      setNotice({ tone: 'error', text: '请检查尺寸、静区、中心比例和颜色是否在允许范围内。' }); return
    }
    if (logoEnabled && (logoError || checkingLogo)) { logoRef.current?.focus(); return }
    if (busy) return
    setBusy(true)
    try {
      const logoData = logoEnabled && logoFile ? await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('无法读取 Logo 图片。'))
        reader.onerror = () => reject(new Error('无法读取 Logo 图片。'))
        reader.readAsDataURL(logoFile)
      }) : undefined
      const response = await fetch(`${QR_API}/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url, format, size, border, center_ratio: centerRatio, color, logo_enabled: logoEnabled, logo_data: logoData, frame_enabled: frameEnabled, frame_shape: frameShape }) })
      if (!response.ok) throw new Error(await readApiError(response, `生成失败（${response.status}）`))
      const blobUrl = URL.createObjectURL(await response.blob())
      setResult((current) => { if (current) URL.revokeObjectURL(current.url); return { url: blobUrl, name: `qrcode.${format}`, ratio: response.headers.get('X-Center-Ratio') ?? String(centerRatio) } })
      setNotice({ tone: 'success', text: '二维码已生成，可以预览或下载。' })
    } catch (error) { setNotice({ tone: 'error', text: `${error instanceof Error ? error.message : '生成失败'} 请检查网络或稍后重试。` }) }
    finally { setBusy(false) }
  }

  return <AppLayout activeTool="qrcode" eyebrow="QR CODE MAKER" title="二维码生成器" description="将链接生成透明二维码，可调整中心 Logo 和边框，适合网页、海报和印刷物。"><div className="workspace-grid">
    <Card title="生成设置" description="填写链接并调整输出参数。"><form noValidate onSubmit={generate}>
      <Field id="qr-url" label="目标链接" hint="必须以 http:// 或 https:// 开头"><input id="qr-url" aria-describedby="qr-url-help" ref={urlRef} value={url} onChange={(e) => setUrl(e.target.value)} inputMode="url" aria-label="目标链接"/></Field>
      <div className="field-row"><Field id="qr-format" label="文件格式"><select id="qr-format" value={format} onChange={(e) => setFormat(e.target.value as 'svg' | 'png')} aria-label="文件格式"><option value="svg">SVG · 矢量</option><option value="png">PNG · 位图</option></select></Field><Field id="qr-size" label="输出尺寸" hint="256–16384 px"><input id="qr-size" aria-describedby="qr-size-help" type="number" min="256" max="16384" value={size} onChange={(e) => setSize(Number(e.target.value))} aria-label="输出尺寸"/></Field></div>
      <div className="field-row"><Field id="qr-border" label="静区宽度" hint="4–32 个模块"><input id="qr-border" aria-describedby="qr-border-help" type="number" min="4" max="32" value={border} onChange={(e) => setBorder(Number(e.target.value))} aria-label="静区宽度"/></Field><Field id="qr-center-ratio" label="中心标识比例" hint="0 隐藏标识，或 0.12–0.36"><input id="qr-center-ratio" aria-describedby="qr-center-ratio-help" type="number" min="0" max=".36" step=".001" value={centerRatio} onChange={(e) => setCenterRatio(Number(e.target.value))} aria-label="中心标识比例"/></Field></div>
      <Field id="qr-color" label="二维码颜色" hint="建议使用较深颜色以确保识别"><div className="color-control"><input type="color" value={color} onChange={(e) => setColor(e.target.value.toUpperCase())} aria-label="选择二维码颜色"/><input id="qr-color" aria-describedby="qr-color-help" value={color} onChange={(e) => setColor(e.target.value)} aria-label="二维码颜色值"/></div></Field>
      <div className="qr-options"><label className="qr-option"><input type="checkbox" checked={logoEnabled} onChange={(e) => setLogoEnabled(e.target.checked)}/>显示中心 Logo</label><span className="qr-option-help">默认使用方屿 Logo，也可以选择自己的图片。</span></div>
      {logoEnabled && <div className="qr-logo-upload"><div className="field-label">自定义 Logo（不上传则默认使用方屿logo）</div><div className={`dropzone qr-logo-dropzone ${dragging ? 'is-dragging' : ''}`} onDragOver={(e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={(e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragging(false); void chooseLogo(e.dataTransfer.files[0]) }}><input ref={logoRef} id="qr-logo-file" type="file" accept="image/png,image/jpeg,image/webp" onChange={(e: ChangeEvent<HTMLInputElement>) => void chooseLogo(e.target.files?.[0])} aria-describedby="qr-logo-help"/><label htmlFor="qr-logo-file"><span className="empty-icon"><Icon name="upload"/></span><strong>{logoFile ? logoFile.name : '拖放 Logo 到这里'}</strong><span>或点击选择图片</span></label></div><div id="qr-logo-help" className="field-help">PNG、JPEG 或 WebP，最大 1 MiB，宽高不超过 2048 px</div>{logoError && <div className="qr-logo-error" role="alert">{logoError}</div>}{logoFile && <button type="button" className="qr-logo-clear" onClick={() => { setLogoFile(null); setLogoError(''); if (logoRef.current) logoRef.current.value = '' }}>使用默认 Logo</button>}</div>}
      <div className="qr-options"><label className="qr-option"><input type="checkbox" checked={frameEnabled} onChange={(e) => setFrameEnabled(e.target.checked)}/>显示中心边框</label>{frameEnabled && <Field id="qr-frame-shape" label="边框形状"><select id="qr-frame-shape" value={frameShape} onChange={(e) => setFrameShape(e.target.value as 'rounded' | 'square')} aria-label="边框形状"><option value="rounded">圆角</option><option value="square">直角</option></select></Field>}</div>
      <Status notice={notice}/><Button icon="qr" busy={busy} disabled={busy || checkingLogo}>{busy ? '正在生成…' : '生成二维码'}</Button>
    </form></Card>
    <Card title="实时结果" description="生成后在这里检查图像并下载。" className="preview-card"><div className={`qr-preview ${result ? 'has-result' : ''}`}>{result ? <img src={result.url} alt="生成的二维码预览"/> : <EmptyState icon="qr" title="等待生成" text="完成左侧设置后生成二维码"/>}</div><div className="preview-meta"><span>H 级纠错</span><span>透明背景</span>{result && <span>中心比例 {result.ratio}</span>}</div>{result && <a className="button button-secondary button-wide" href={result.url} download={result.name}><Icon name="download"/>下载 {result.name.toUpperCase()}</a>}</Card>
  </div></AppLayout>
}
