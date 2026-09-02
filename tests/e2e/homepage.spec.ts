import { expect, test } from '@playwright/test'

const SECTION_NAMES = [
  'Introduction',
  'Now',
  'Latest moments',
  'Latest writing',
  'Selected work',
  'Photography',
]

test('tells the personal story across six ordered sections', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1 })).toContainText('I started with cameras')
  await expect(page.getByText('Then I became curious about how machines see.')).toBeVisible()

  for (const name of SECTION_NAMES) {
    await expect(page.getByRole('region', { name })).toBeVisible()
  }

  const offsets: number[] = []
  for (const name of SECTION_NAMES) {
    offsets.push(
      await page
        .getByRole('region', { name })
        .evaluate((el) => el.getBoundingClientRect().top + window.scrollY),
    )
  }
  expect([...offsets].sort((a, b) => a - b)).toEqual(offsets)

  await expect(page.getByText('Human vision records a moment.')).toBeVisible()
  await expect(page.getByText('Machine vision tries to understand it.')).toBeVisible()
})

test('shows exactly three latest moments', async ({ page }) => {
  await page.goto('/')
  const moments = page.getByRole('region', { name: 'Latest moments' }).getByRole('article')
  await expect(moments).toHaveCount(3)
  await expect(moments.nth(0)).toContainText('Reproduced the Mini DeepID baseline')
  await expect(moments.nth(1)).toContainText('A photograph-led entry')
  await expect(moments.nth(2)).toContainText('A lighter observation')
})

test('surfaces the selected work with narrative, not tech lists', async ({ page }) => {
  await page.goto('/')
  const work = page.getByRole('region', { name: 'Selected work' })
  await expect(work).toContainText('Mini DeepID')
  await expect(work).toContainText('CV Lab')
  await expect(work).toContainText('Robotics Experiments')
  await expect(work).toContainText(
    'Can a small DeepID-style network learn identity features from a tiny face dataset?',
  )
  await expect(work).toContainText('77.50% test accuracy on the mini face identification task')
  await expect(work.getByRole('article')).toHaveCount(3)
})

test('exposes date and reading time on writing previews', async ({ page }) => {
  await page.goto('/')
  const writing = page.getByRole('region', { name: 'Latest writing' })
  await expect(writing).toContainText('Validation Loss and the Gap to Test Error')
  await expect(writing).toContainText('2026-08-30')
  await expect(writing).toContainText('5 min read')
  await expect(writing).toContainText('note')
})
