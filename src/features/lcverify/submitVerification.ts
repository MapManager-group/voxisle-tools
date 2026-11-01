export async function submitVerification(search: string) {
  const params = new URLSearchParams(search)
  const body = Object.fromEntries(['userName', 'verify'].map(key => {
    const values = params.getAll(key)
    if (values.length !== 1 || !values[0].trim()) throw new Error('验证链接不完整或参数重复，请使用完整的原始链接。')
    return [key, values[0]]
  }))

  await fetch('https://hanamizu.feishu.cn/base/workflow/webhook/event/DJvLazywFwPCathZb3scjT4mnp3', {
    method: 'POST',
    mode: 'no-cors',
    credentials: 'omit',
    referrerPolicy: 'no-referrer',
    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  }).catch(error => {
    throw new Error(error instanceof Error && error.name === 'TimeoutError'
      ? '请求超时，处理结果尚未确认。请联系管理员，避免重复提交。'
      : '网络异常，无法确认请求是否送达。请联系管理员，避免重复提交。')
  })
}
