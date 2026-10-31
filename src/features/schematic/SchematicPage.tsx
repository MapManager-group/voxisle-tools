import {useRef, useState, type FormEvent} from 'react'
import {AppLayout} from '../../components/layout/AppLayout'
import {Button, Card, Field, Status, type Notice} from '../../components/ui'
import {Icon} from '../../components/ui/Icon'
import {SCHEMATIC_API} from '../../config'
import {downloadBlob, readApiError, responseFilename} from '../../lib/api'
import {formatBytes} from '../../lib/format'
import {Credential} from './Credential'

type UploadResult = { download_key: string; delete_key: string }
const allowedFilePattern = /\.(schem|schematic)$/i
const fileTypeError = '仅支持 .schem 和 .schematic 文件。'

export function SchematicPage() {
    const [file, setFile] = useState<File | null>(null), [dragging, setDragging] = useState(false)
    const [uploadResult, setUploadResult] = useState<UploadResult | null>(null), [downloadKey, setDownloadKey] = useState('')
    const [notice, setNotice] = useState<Notice>(null), [downloadNotice, setDownloadNotice] = useState<Notice>(null)
    const [busy, setBusy] = useState(false), [downloading, setDownloading] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)

    function choose(next?: File) {
        if (!next) return
        if (!allowedFilePattern.test(next.name)) {
            setFile(null);
            setUploadResult(null);
            setNotice({tone: 'error', text: fileTypeError})
            if (fileRef.current) fileRef.current.value = ''
            return
        }
        setFile(next);
        setUploadResult(null);
        setNotice(null)
    }

    async function upload(event: FormEvent) {
        event.preventDefault();
        if (!file) {
            setNotice({tone: 'error', text: '请先选择一个 GZIP 压缩的 NBT 文件。'});
            fileRef.current?.focus();
            return
        }
        if (!allowedFilePattern.test(file.name)) {
            setNotice({tone: 'error', text: fileTypeError});
            setFile(null);
            fileRef.current?.focus();
            return
        }
        const body = new FormData();
        body.append('schematic', file, file.name);
        setBusy(true);
        setNotice(null)
        try {
            const response = await fetch(`${SCHEMATIC_API}/upload`, {method: 'POST', body});
            if (!response.ok) throw new Error(await readApiError(response, `上传失败（${response.status}）`));
            const data = await response.json() as UploadResult;
            setUploadResult(data);
            setDownloadKey(data.download_key);
            setNotice({tone: 'success', text: '文件已上传。请保存下面的下载密钥和加载命令。'})
        } catch (error) {
            setNotice({tone: 'error', text: error instanceof Error ? error.message : '上传失败，请稍后重试。'})
        } finally {
            setBusy(false)
        }
    }

    async function download(event: FormEvent) {
        event.preventDefault();
        const key = downloadKey.trim();
        if (!key) {
            setDownloadNotice({tone: 'error', text: '请输入下载密钥。'});
            return
        }
        setDownloading(true);
        setDownloadNotice(null)
        try {
            const response = await fetch(`${SCHEMATIC_API}/download/${encodeURIComponent(key)}`);
            if (!response.ok) throw new Error(await readApiError(response, response.status === 420 ? '文件已过期或不存在。' : `下载失败（${response.status}）`));
            const name = responseFilename(response, 'download.schem');
            downloadBlob(await response.blob(), name);
            setDownloadNotice({tone: 'success', text: `已开始下载 ${name}。`})
        } catch (error) {
            setDownloadNotice({tone: 'error', text: error instanceof Error ? error.message : '下载失败，请稍后重试。'})
        } finally {
            setDownloading(false)
        }
    }

    async function copy(value: string, label: string) {
        try {
            await navigator.clipboard.writeText(value);
            setNotice({tone: 'success', text: `${label}已复制。`})
        } catch {
            setNotice({tone: 'error', text: '浏览器未允许复制，请手动选择密钥。'})
        }
    }

    return <AppLayout activeTool="schematic" eyebrow="SCHEMATIC CLOUD" title="Schematic Cloud"
                      description="上传并分享 Minecraft 建筑蓝图。下载密钥用于分享，密钥请妥善保管。">
        <div className="schematic-grid">
            <Card title="上传蓝图" description="服务会验证 GZIP 与 NBT 数据后保存原始文件。">
                <form noValidate onSubmit={upload}>
                    <div className={`dropzone ${dragging ? 'is-dragging' : ''}`} onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true)
                    }} onDragLeave={() => setDragging(false)} onDrop={(e) => {
                        e.preventDefault();
                        setDragging(false);
                        choose(e.dataTransfer.files[0])
                    }}><input ref={fileRef} id="schematic-file" type="file" accept=".schem,.schematic"
                              onChange={(e) => choose(e.target.files?.[0])}/><label htmlFor="schematic-file"><span
                        className="empty-icon"><Icon
                        name="upload"/></span><strong>{file ? file.name : '拖放蓝图到这里'}</strong><span>{file ? formatBytes(file.size) : '或点击选择 .schem 或 .schematic 文件'}</span></label>
                    </div>
                    <Status notice={notice}/><Button icon="upload" busy={busy}
                                                     disabled={busy}>{busy ? '正在上传…' : '上传蓝图'}</Button></form>
            </Card>
            <Card title="通过密钥下载" description="输入上传者分享的下载密钥。">
                <form noValidate onSubmit={download}><Field id="schematic-download-key" label="下载密钥" hint="32 位小写十六进制字符串"><input
                    id="schematic-download-key" aria-describedby="schematic-download-key-help" className="mono" value={downloadKey} onChange={(e) => setDownloadKey(e.target.value)}
                    autoComplete="off" aria-label="下载密钥"/></Field><Status notice={downloadNotice}/><Button
                    icon="download" tone="secondary" busy={downloading}
                    disabled={downloading}>{downloading ? '正在下载…' : '下载文件'}</Button></form>
            </Card>
        </div>
        {uploadResult && <Card title="上传凭证" description="密钥不会再次显示，请现在复制并保存在安全位置。"
                               className="credentials-card">
            <div className="credential-grid"><Credential label="下载密钥 · 可分享" value={uploadResult.download_key}
                                                         onCopy={() => copy(uploadResult.download_key, '下载密钥')}/>
              <Credential
                label="在方屿加载" value={`/schemcloud load url:${uploadResult.download_key}`}
                onCopy={() => copy(`/schemcloud load url:${uploadResult.download_key}`, '加载命令')}/>
            </div>
        </Card>}</AppLayout>
}
