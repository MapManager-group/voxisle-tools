const assert = require('node:assert/strict')
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')
const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:5185'
const webhook = 'https://hanamizu.feishu.cn/base/workflow/webhook/event/DJvLazywFwPCathZb3scjT4mnp3'

;(async () => {
  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage()
    let calls = 0, payload, finish
    let mode = 'pending'
    await page.route('**/*', async route => {
      const request = route.request(), url = new URL(request.url())
      assert.notEqual(url.pathname, '/api/lcverify')
      if (request.url() !== webhook) return url.origin === origin ? route.continue() : route.abort()
      calls++
      assert.equal(request.method(), 'POST')
      assert.match(request.headers()['content-type'], /^text\/plain/i)
      assert.equal(request.headers().referer, undefined)
      payload = JSON.parse(request.postData())
      if (mode === 'pending') await new Promise(resolve => { finish = resolve })
      if (mode === 'offline') return route.abort()
      // No CORS headers: the browser must still send without OPTIONS or reading the response.
      return route.fulfill({ status: mode === 'http-error' ? 503 : 200, contentType: 'application/json', body: JSON.stringify({ code: mode === 'rejected' ? 1 : 0 }) })
    })
    const query = '?userName=%E6%B5%8B%E8%AF%95%2B%26&verify=a%3Db&extra=ignored'
    await page.goto(origin + '/lcverify' + query)
    await page.getByRole('status').filter({ hasText: '正在发送' }).waitFor()
    await page.waitForFunction(() => document.title === '验证 · 方屿工具箱')
    assert.equal(calls, 1)
    assert.deepEqual(payload, { userName: '测试+&', verify: 'a=b' })
    finish()
    await page.getByRole('status').filter({ hasText: '无法确认飞书处理结果' }).waitFor()
    assert.equal(calls, 1)
    await page.goto(origin + '/lcverify?userName=x')
    await page.getByRole('alert').filter({ hasText: '链接不完整' }).waitFor()
    assert.equal(calls, 1)
    for (mode of ['http-error', 'rejected']) {
      await page.goto(origin + '/lcverify/' + query)
      await page.getByRole('status').filter({ hasText: '无法确认飞书处理结果' }).waitFor()
    }
    mode = 'offline'
    await page.goto(origin + '/lcverify/' + query)
    await page.getByRole('alert').filter({ hasText: '网络异常' }).waitFor()
    assert.equal(calls, 4)
    await page.goto(origin)
    const desktopLink = page.locator('aside').getByRole('link', { name: '地图管理平台' })
    assert.equal(await desktopLink.getAttribute('href'), 'https://map.voxisle.art')
    assert.equal(await desktopLink.getAttribute('target'), '_blank')
    assert.equal(await page.locator('a[href*="lcverify"]').count(), 0)
    await page.setViewportSize({ width: 390, height: 844 })
    await page.getByRole('button', { name: /打开.*菜单/ }).click()
    const mobileLink = page.getByRole('dialog').getByRole('link', { name: '地图管理平台' })
    await mobileLink.focus()
    assert.equal(await mobileLink.evaluate(el => el === document.activeElement), true)
    await mobileLink.click()
    await page.getByRole('dialog').waitFor({ state: 'hidden' })
    console.log('Browser checks passed: direct no-preflight POST, one StrictMode request, payload, opaque response, invalid links, network failure and sidebar.')
  } finally {
    await browser.close()
  }
})().catch(error => { console.error(error); process.exitCode = 1 })
