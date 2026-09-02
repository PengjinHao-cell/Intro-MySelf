import { expect, test } from '@playwright/test'

const listingRoutes = [
  { path: '/moments', heading: 'Moments', link: '/moments/first-reproduction' },
  { path: '/writing', heading: 'Writing', link: '/writing/validation-loss' },
  { path: '/work', heading: 'Work', link: '/work/mini-deepid' },
  { path: '/photos', heading: 'Photos', link: '/photos/city-light' },
  { path: '/about', heading: 'About' },
]

for (const route of listingRoutes) {
  test(`${route.path} shows its heading and a published fixture link`, async ({ page }) => {
    await page.goto(route.path)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(route.heading)
    if (route.link) {
      await expect(page.locator(`a[href="${route.link}"]`)).toBeVisible()
    }
  })
}

test('moment detail renders date, city, body, and breadcrumb', async ({ page }) => {
  await page.goto('/moments/first-reproduction')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('2026-08-28')
  await expect(page.getByText('Nanjing')).toBeVisible()
  await expect(page.getByText('Reproduced the Mini DeepID baseline')).toBeVisible()
  const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' })
  await expect(breadcrumb.getByRole('link', { name: 'Home' })).toBeVisible()
  await expect(breadcrumb.getByRole('link', { name: 'Moments' })).toBeVisible()
})

test('writing detail renders title, metadata, body, and breadcrumb', async ({ page }) => {
  await page.goto('/writing/validation-loss')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Validation Loss and the Gap to Test Error',
  )
  await expect(page.getByText('note', { exact: true })).toBeVisible()
  await expect(page.getByText('5 min read')).toBeVisible()
  await expect(page.getByText('2026-08-30')).toBeVisible()
  await expect(page.getByText('Validation loss tracks what training accuracy cannot')).toBeVisible()
  const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' })
  await expect(breadcrumb.getByRole('link', { name: 'Writing' })).toBeVisible()
})

test('project detail preserves the narrative order', async ({ page }) => {
  await page.goto('/work/mini-deepid')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mini DeepID')
  const headings = page.getByRole('heading', { level: 2 })
  await expect(headings).toContainText([
    'Overview',
    'Question',
    'Process',
    'Result',
    'What I Learned',
  ])
  const offsets: number[] = []
  for (const label of ['Overview', 'Question', 'Process', 'Result', 'What I Learned']) {
    offsets.push(
      await page
        .getByRole('heading', { level: 2, name: label })
        .evaluate((el) => el.getBoundingClientRect().top + window.scrollY),
    )
  }
  expect([...offsets].sort((a, b) => a - b)).toEqual(offsets)
  await expect(page.getByText('77.50% test accuracy')).toBeVisible()
})

test('photo detail renders title, category metadata, and breadcrumb', async ({ page }) => {
  await page.goto('/photos/city-light')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('City Light Study')
  await expect(page.getByText('City', { exact: true })).toBeVisible()
  await expect(page.getByText('Nanjing')).toBeVisible()
  const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' })
  await expect(breadcrumb.getByRole('link', { name: 'Photos' })).toBeVisible()
})

test('unknown paths show the custom 404 page', async ({ page }) => {
  await page.goto('/does-not-exist')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Page not found')
})

test('drafts stay out of listings and routes', async ({ page }) => {
  await page.goto('/writing')
  await expect(page.getByText('Unpublished Draft Note')).toHaveCount(0)

  await page.goto('/writing/quiet-draft')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Page not found')
})

test('work groups categories without empty sections', async ({ page }) => {
  await page.goto('/work')
  await expect(page.getByRole('heading', { level: 2, name: 'Computer Vision' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Robotics' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Deep Learning' })).toHaveCount(0)
})
