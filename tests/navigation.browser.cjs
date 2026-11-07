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
    for (const [hash, heading] of [['schematic', 'Schematic Cloud'], ['resources', '素材网站']]) {
      await page.goto(`${origin}/#${hash}`)
      await page.getByRole('heading', { name: heading, level: 1 }).waitFor()
    }
    assert.deepEqual(errors, [])
    console.log('Navigation checks passed: grouping, six links, direct route, removed route, themes, responsive layout, keyboard, mobile menu and sibling pages.')
  } finally {
    await browser.close()
  }
})().catch(error => { console.error(error); process.exitCode = 1 })
