import { expect, test } from '@playwright/test'

test('serves the personal garden locally', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Personal Digital Garden/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('I started with cameras')
})

test('renders the editorial design shell', async ({ page }) => {
  await page.goto('/')

  const nav = page.getByRole('navigation', { name: 'Primary' })
  await expect(nav.getByRole('link')).toHaveText(['Moments', 'Writing', 'Work', 'Photos', 'About'])
  await expect(page.getByRole('main')).toHaveCount(1)

  const tokens = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement)
    return {
      paper: styles.getPropertyValue('--paper').trim().toLowerCase(),
      ink: styles.getPropertyValue('--ink').trim().toLowerCase(),
    }
  })
  expect(tokens.paper).toBe('#f2efe7')
  expect(tokens.ink).toBe('#1d211c')

  await page.keyboard.press('Tab')
  const skipLink = page.getByRole('link', { name: 'Skip to content' })
  await expect(skipLink).toBeFocused()
  const skipVisible = await skipLink.evaluate((el) => {
    const rect = el.getBoundingClientRect()
    return rect.width > 0 && rect.height > 0
  })
  expect(skipVisible).toBe(true)
})

test('has no horizontal overflow on a phone viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
})
