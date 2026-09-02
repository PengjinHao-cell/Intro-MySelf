import { expect, test } from '@playwright/test'

test('serves the local editor with the configured collections', async ({ page }) => {
  const externalOrigins = new Set<string>()

  page.on('request', (request) => {
    const url = new URL(request.url())
    if (url.origin !== 'http://127.0.0.1:4321') {
      externalOrigins.add(url.origin)
    }
  })

  await page.goto('/keystatic')

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Moments' })).toBeVisible()
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Writing' })).toBeVisible()
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Projects' })).toBeVisible()
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Photo Stories' })).toBeVisible()
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Timeline' })).toBeVisible()
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Site Settings' })).toBeVisible()

  await expect(page.getByRole('button', { name: 'Add' }).first()).toBeVisible()

  expect([...externalOrigins]).toEqual([])
})
