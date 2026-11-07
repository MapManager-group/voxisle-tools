const assert = require('node:assert/strict')
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')
const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:5185'
const title = '洛林 · 世界 Lorian City 专区'
const links = [
  'https://lorianstudio.feishu.cn/wiki/GVgSw7M0hiw2kekUSnRcy5P4n9b',
  'https://dynmap.voxisle.art',
  'https://hanamizu.feishu.cn/share/base/form/shrcnAKCPZ1o87t1E8dETDXlS7c',
  'https://hanamizu.feishu.cn/share/base/form/shrcn3OYmCAe5nkREtZCKamUQvc',
  'https://hanamizu.feishu.cn/share/base/form/shrcnZOqfrGAJZeImd67OgbY21e',
  'https://hanamizu.feishu.cn/share/base/form/shrcnbxivp3TFo12eKLIBSJjZpb',
]

;(async () => {
  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort())
    await page.goto(origin)
    const group = page.locator('aside.sidebar .nav-group').filter({ hasText: '方屿工具' })
    assert.deepEqual(await group.locator('a').allTextContents(), ['地图管理平台', 'Schematic Cloud', title])
    assert.equal(await page.locator('a[href="#qrcode"]').count(), 0)
    const main = page.locator('main')
    assert.deepEqual(await main.locator('.section-title h2').allTextContents(), ['服务器工具', '社区和服务器指南', '工具与资源'])
    assert.deepEqual(await main.locator('.tool-card a[href^="#"]').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')).sort()), ['#creative-tools', '#lorian-city', '#resources', '#schematic'])
    assert.equal(await main.locator('a[href="https://bdengine.app"]').count(), 0)
    await main.locator('a[href="#creative-tools"]').click()
    await page.getByRole('heading', { name: '创作工具', level: 1 }).waitFor()
    await page.waitForFunction(() => document.title === '创作工具 · 方屿工具箱')
    assert.equal(await page.locator('aside.sidebar a[href="#creative-tools"]').getAttribute('aria-current'), 'page')
    assert.deepEqual(await main.locator('.section-title h2').allTextContents(), ['生成器', '配色工具', '转换工具'])
    assert.deepEqual(await main.locator('.section-count').allTextContents(), ['9', '6', '4'])
    assert.equal(await main.locator('.tool-card').count(), 19)
    for (const theme of ['light', 'dark']) {
      await page.evaluate(value => { document.documentElement.dataset.theme = value }, theme)
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 1000 })
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
        if (process.env.SCREENSHOT_DIR) await page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/creative-tools-${theme}-${width}.png`, fullPage: true })
      }
    }
    await page.getByRole('button', { name: '打开导航菜单' }).click()
    await page.getByRole('dialog').getByRole('link', { name: '工具首页' }).click()
    await page.getByRole('dialog').waitFor({ state: 'hidden' })
    await page.getByRole('heading', { name: '工具首页', level: 1 }).waitFor()
    await page.getByRole('button', { name: '打开导航菜单' }).click()
    await page.getByRole('dialog').getByRole('link', { name: '创作工具', exact: true }).click()
    await page.getByRole('dialog').waitFor({ state: 'hidden' })
    await page.getByRole('heading', { name: '创作工具', level: 1 }).waitFor()
    await page.setViewportSize({ width: 1440, height: 1000 })

    await group.getByRole('link', { name: title }).click()
    await page.getByRole('heading', { name: title, level: 1 }).waitFor()
    await page.waitForFunction(expected => document.title === expected, `${title} · 方屿工具箱`)
    assert.equal(await group.getByRole('link', { name: title }).getAttribute('aria-current'), 'page')
    const cards = page.locator('main .tool-card')
    assert.equal(await cards.count(), 6)
    for (let index = 0; index < links.length; index++) {
      const link = cards.nth(index).getByRole('link')
      assert.equal(await link.getAttribute('href'), links[index])
      assert.equal(await link.getAttribute('target'), '_blank')
      assert.match(await link.getAttribute('rel'), /noopener/)
    }
    assert.match(await cards.last().textContent(), /已有权限.*一次性申请多个权限/)
    assert.equal(await page.locator('.service-status').count(), 0)
    for (const theme of ['light', 'dark']) {
      await page.evaluate(value => { document.documentElement.dataset.theme = value }, theme)
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 1000 })
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
        if (process.env.SCREENSHOT_DIR) await page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/lorian-city-${theme}-${width}.png`, fullPage: true })
      }
    }
    await page.getByRole('button', { name: '打开导航菜单' }).click()
    const dialog = page.getByRole('dialog')
    await dialog.getByRole('link', { name: title }).focus()
    await page.keyboard.press('Escape')
    await dialog.waitFor({ state: 'hidden' })
    assert.equal(await page.getByRole('button', { name: '打开导航菜单' }).evaluate(el => el === document.activeElement), true)
    await page.getByRole('button', { name: '打开导航菜单' }).click()
    await dialog.getByRole('link', { name: '工具首页' }).click()
    await dialog.waitFor({ state: 'hidden' })
    await page.getByRole('heading', { name: '工具首页', level: 1 }).waitFor()
    await page.locator('main .tool-card').filter({ hasText: title }).getByRole('link').click()
    await page.getByRole('heading', { name: title, level: 1 }).waitFor()
    await page.goto(origin + '/#lorian-city')
    await page.getByRole('heading', { name: title, level: 1 }).waitFor()
    await page.goto(origin + '/#qrcode')
    await page.getByRole('heading', { name: '工具首页', level: 1 }).waitFor()
    for (const [hash, heading] of [['creative-tools', '创作工具'], ['schematic', 'Schematic Cloud'], ['resources', '素材网站']]) {
      await page.goto(`${origin}/#${hash}`)
      await page.getByRole('heading', { name: heading, level: 1 }).waitFor()
    }
    await page.goto(origin + '/#schematic')
    const guide = page.locator('.card').filter({ has: page.getByRole('heading', { name: '从服务器导出schem', exact: true }) })
    await guide.waitFor()
    assert.equal(await guide.locator('li').count(), 3)
    assert.deepEqual(await guide.locator('code').allTextContents(), ['//copy', '/schemcloud download'])
    await page.setViewportSize({ width: 1440, height: 1000 })
    const downloadCard = page.locator('.card').filter({ has: page.getByRole('heading', { name: '通过密钥下载', exact: true }) })
    const downloadBox = await downloadCard.boundingBox(), guideBox = await guide.boundingBox()
    assert.equal(guideBox.x, downloadBox.x)
    assert.ok(guideBox.y >= downloadBox.y + downloadBox.height)
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 })
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
      if (process.env.SCREENSHOT_DIR) await page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/schematic-export-${width}.png`, fullPage: true })
    }
    await page.evaluate(() => {
      window.copiedCommands = []
      Object.defineProperty(navigator.clipboard, 'writeText', { configurable: true, writable: true, value: async text => { window.copiedCommands.push(text) } })
    })
    await guide.getByRole('button', { name: '复制 //copy', exact: true }).click()
    await page.getByRole('status').filter({ hasText: '//copy已复制。' }).waitFor()
    await guide.getByRole('button', { name: '复制 /schemcloud download', exact: true }).focus()
    await page.keyboard.press('Enter')
    await page.getByRole('status').filter({ hasText: '/schemcloud download已复制。' }).waitFor()
    assert.deepEqual(await page.evaluate(() => window.copiedCommands), ['//copy', '/schemcloud download'])
    await page.evaluate(() => { navigator.clipboard.writeText = async () => { throw new Error('Clipboard permission denied') } })
    await guide.getByRole('button', { name: '复制 //copy', exact: true }).click()
    await page.getByRole('alert').filter({ hasText: '//copy复制失败，请手动选择并复制。' }).waitFor()
    let uploadFails = true
    await page.route('**/upload', route => route.fulfill({
      status: uploadFails ? 503 : 200,
      contentType: 'application/json',
      body: JSON.stringify(uploadFails ? { detail: '模拟上传失败' } : { download_key: 'a'.repeat(32), delete_key: 'b'.repeat(32) }),
    }))
    await page.locator('#schematic-file').setInputFiles({ name: 'example.schem', mimeType: 'application/octet-stream', buffer: Buffer.from([31, 139, 8, 0]) })
    await guide.waitFor()
    await page.getByRole('button', { name: '上传蓝图', exact: true }).click()
    await page.getByRole('alert').waitFor()
    await guide.waitFor()
    uploadFails = false
    await page.getByRole('button', { name: '上传蓝图', exact: true }).click()
    await page.getByRole('heading', { name: '上传凭证', exact: true }).waitFor()
    assert.equal(await guide.count(), 0)
    assert.equal(await downloadCard.count(), 0)
    const credentials = page.locator('.card').filter({ has: page.getByRole('heading', { name: '上传凭证', exact: true }) })
    assert.equal(await credentials.locator('.credential').count(), 2)
    assert.deepEqual(await credentials.locator('.credential code').allTextContents(), ['a'.repeat(32), `/schemcloud load url:${'a'.repeat(32)}`])
    await page.setViewportSize({ width: 1440, height: 1000 })
    const uploadCard = page.locator('.card').filter({ has: page.getByRole('heading', { name: '上传蓝图', exact: true }) })
    const uploadBox = await uploadCard.boundingBox(), credentialsBox = await credentials.boundingBox()
    assert.ok(credentialsBox.x > uploadBox.x + uploadBox.width)
    assert.equal(credentialsBox.y, uploadBox.y)
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 })
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
      if (process.env.SCREENSHOT_DIR) await page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/schematic-credentials-${width}.png`, fullPage: true })
    }
    await page.locator('#schematic-file').setInputFiles({ name: 'another.schem', mimeType: 'application/octet-stream', buffer: Buffer.from([31, 139, 8, 0]) })
    await guide.waitFor()
    await downloadCard.waitFor()
    assert.equal(await credentials.count(), 0)
    assert.deepEqual(errors, [])
    console.log('Navigation checks passed: homepage separation, 19 creative tools, grouping, six links, direct routes, removed route, themes, responsive layout, keyboard, mobile menu, sibling pages and schematic export guidance states.')
  } finally {
    await browser.close()
  }
})().catch(error => { console.error(error); process.exitCode = 1 })
