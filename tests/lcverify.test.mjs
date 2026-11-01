import assert from 'node:assert/strict'
import { test } from 'node:test'
import { submitVerification } from '../src/features/lcverify/submitVerification.ts'

const webhook = 'https://hanamizu.feishu.cn/base/workflow/webhook/event/DJvLazywFwPCathZb3scjT4mnp3'

test('direct no-cors JSON request, validation and network failures', async () => {
  const originalFetch = globalThis.fetch
  const calls = []
  // Opaque responses expose neither HTTP status nor body, even on server errors.
  globalThis.fetch = async (...args) => {
    calls.push(args)
    return new Proxy({}, {
      get(_target, key) {
        if (key === 'then') return undefined
        throw new Error('must not read an opaque response')
      },
    })
  }
  try {
    for (const search of ['', '?userName=a', '?verify=c', '?userName=%20&verify=c', '?userName=a&verify=c&verify=d', '?userName=a&userName=b&verify=c']) {
      await assert.rejects(submitVerification(search), /链接不完整或参数重复/)
    }
    assert.equal(calls.length, 0)
    const query = '?userName=%E6%B5%8B%E8%AF%95%2B%26&verify=a%3Db&extra=ignored'
    await submitVerification(query)
    const [url, options] = calls[0]
    assert.equal(url, webhook)
    assert.equal(options.method, 'POST')
    assert.equal(options.mode, 'no-cors')
    assert.equal(options.credentials, 'omit')
    assert.equal(options.referrerPolicy, 'no-referrer')
    assert.equal(options.headers['Content-Type'], 'text/plain;charset=UTF-8')
    assert.deepEqual(JSON.parse(options.body), { userName: '测试+&', verify: 'a=b' })
    await submitVerification(`${query}&recordId=ignored`)
    assert.deepEqual(JSON.parse(calls[1][1].body), { userName: '测试+&', verify: 'a=b' })
    globalThis.fetch = async () => { throw new TypeError('offline') }
    await assert.rejects(submitVerification(query), /网络异常/)
    globalThis.fetch = async () => { throw new DOMException('timed out', 'TimeoutError') }
    await assert.rejects(submitVerification(query), /请求超时/)
  } finally {
    globalThis.fetch = originalFetch
  }
})
