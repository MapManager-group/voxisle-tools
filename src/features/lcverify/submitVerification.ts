export async function submitVerification(search: string) {
  const params = new URLSearchParams(search)
  const body = Object.fromEntries(['userName', 'verify'].map(key => {
    const values = params.getAll(key)
    if (values.length !== 1 || !values[0].trim()) throw new Error('验证链接不完整或参数重复，请使用完整的原始链接。')
    return [key, values[0]]
  }))
  const response = await fetch('/api/lcverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  })
  if (!response.ok) throw new Error(`提交失败（${response.status}），请联系管理员确认处理结果。`)
  const result = await response.json()
  if (result.code !== undefined && result.code !== 0) throw new Error('验证服务未接受请求，请联系管理员。')
}
