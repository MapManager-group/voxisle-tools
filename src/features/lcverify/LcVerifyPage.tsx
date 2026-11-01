import { useEffect, useRef, useState } from 'react'
import { Card, Status, type Notice } from '../../components/ui'
import { submitVerification } from './submitVerification'

export function LcVerifyPage() {
  const request = useRef<Promise<void> | null>(null)
  const [notice, setNotice] = useState<Notice>(null)
  useEffect(() => {
    document.title = '验证 · 方屿工具箱'
    // StrictMode 重放 effect 时复用请求，避免重复触发工作流。
    request.current ??= submitVerification(location.search)
    let active = true
    request.current.then(() => {
      if (active) setNotice({ tone: 'success', text: '验证请求已提交，可以关闭此页面。' })
    }).catch(error => {
      if (active) setNotice({ tone: 'error', text: error instanceof Error && error.name === 'Error' ? error.message : '无法确认提交结果，请联系管理员确认，避免重复提交。' })
    })
    return () => { active = false }
  }, [])
  return <main className="main"><Card title="验证" description="正在处理此验证链接。">
    {notice ? <Status notice={notice}/> : <p role="status" aria-busy="true">正在提交，请稍候…</p>}
  </Card></main>
}
