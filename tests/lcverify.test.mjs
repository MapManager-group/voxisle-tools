import assert from 'node:assert/strict'
import { test } from 'node:test'
import { submitVerification } from '../src/features/lcverify/submitVerification.ts'

test('verification query validation, JSON body and failure handling', async () => {
  const originalFetch = globalThis.fetch
  const calls = []
  let response = new Response('{"code":0}', { status: 200 })
  globalThis.fetch = async (...args) => { calls.push(args); return response.clone() }
  try {
    for (const search of ['', '?userName=a', '?userName=%20&verify=c', '?userName=a&verify=c&verify=d']) {
      await assert.rejects(submitVerification(search), /链接不完整或参数重复/)
    }
    assert.equal(calls.length, 0)
    const query = '?userName=%E6%B5%8B%E8%AF%95%2B%26&verify=a%3Db&extra=ignored'
    await submitVerification(query)
    const [url, options] = calls[0]
    assert.equal(url, '/api/lcverify')
    assert.equal(options.method, 'POST')
    assert.equal(options.headers['Content-Type'], 'application/json')
    assert.deepEqual(JSON.parse(options.body), { userName: '测试+&', verify: 'a=b' })
    await submitVerification(`${query}&recordId=ignored`)
    assert.deepEqual(JSON.parse(calls[1][1].body), { userName: '测试+&', verify: 'a=b' })
    response = new Response('{}', { status: 503 })
    await assert.rejects(submitVerification(query), /503/)
    response = new Response('{"code":1}', { status: 200 })
    await assert.rejects(submitVerification(query), /未接受请求/)
    response = new Response('<html>fallback</html>', { status: 200 })
    await assert.rejects(submitVerification(query), SyntaxError)
    globalThis.fetch = async () => { throw new TypeError('offline') }
    await assert.rejects(submitVerification(query), /offline/)
  } finally {
    globalThis.fetch = originalFetch
  }
})
