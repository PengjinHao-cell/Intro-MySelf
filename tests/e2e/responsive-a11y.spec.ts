import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const PAGES = [
  '/',
  '/moments',
  '/writing',
  '/work',
  '/photos',
  '/about',
  '/moments/first-reproduction',
  '/writing/validation-loss',
  '/work/mini-deepid',
  '/photos/city-light',
]

const viewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 },
]

for (const viewport of viewports) {
  test(`no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    for (const path of PAGES) {
      await page.goto(path)
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }))
      expect(scrollWidth, `${path} overflows at ${viewport.width}px`).toBeLessThanOrEqual(clientWidth)
    }
  })
}

test('axe reports no serious or critical violations', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page }).analyze()
  const severe = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
  expect(severe).toEqual([])
})

test('keyboard reaches the skip link and the primary navigation', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.locator('a:focus').first()).not.toHaveCount(0)
})

test('the mobile menu opens without hover and restores focus on close', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  // The button label switches between "Menu" and "Close", so pin it by class.
  const toggle = page.getByRole('banner').locator('.mobile-nav__toggle')
  await expect(toggle).toBeVisible()
  // Wait for React hydration: the SSR button has no handler until the island
  // hydrates, and a click before that would be silently lost.
  await page.waitForFunction(() => {
    const el = document.querySelector('.mobile-nav__toggle')
    return !!el && Object.keys(el).some((key) => key.startsWith('__reactFiber'))
  })
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'About' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(toggle).toBeFocused()
})

test('informative images all carry alternative text', async ({ page }) => {
  await page.goto('/')
  const missing = await page.$$eval('img', (imgs) =>
    imgs.filter((img) => !(img.getAttribute('alt') ?? '').trim()).length,
  )
  expect(missing).toBe(0)
})

test('reduced motion removes nonessential transition durations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const duration = await page.evaluate(() => {
    const skip = document.querySelector('.skip-link')
    return skip ? getComputedStyle(skip).transitionDuration : 'none'
  })
  const durationMs = parseFloat(duration) * (duration.endsWith('ms') ? 1 : 1000)
  expect(durationMs).toBeLessThanOrEqual(1)
})

test('rss and sitemap include published entries and exclude drafts', async ({ page }) => {
  const rss = await page.request.get('/rss.xml')
  expect(rss.status()).toBe(200)
  const rssBody = await rss.text()
  expect(rssBody).toContain('Validation Loss and the Gap to Test Error')
  expect(rssBody).not.toContain('Unpublished Draft Note')

  const sitemapIndex = await page.request.get('/sitemap-index.xml')
  expect(sitemapIndex.status()).toBe(200)
  const indexBody = await sitemapIndex.text()
  const sitemapUrl = indexBody.match(/https?:\/\/[^<]*sitemap-\d+\.xml/)?.[0]
  expect(sitemapUrl).toBeTruthy()
  if (!sitemapUrl) return

  const sitemap = await page.request.get(new URL(sitemapUrl).pathname)
  const sitemapBody = await sitemap.text()
  expect(sitemapBody).toContain('/writing/validation-loss')
  expect(sitemapBody).not.toContain('/writing/quiet-draft')
})

test('pages carry canonical metadata', async ({ page }) => {
  await page.goto('/moments')
  const canonical = page.locator('link[rel="canonical"]')
  await expect(canonical).toHaveAttribute('href', 'http://127.0.0.1:4321/moments')
})
