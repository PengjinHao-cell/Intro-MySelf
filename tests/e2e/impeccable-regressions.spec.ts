import { expect, test } from '@playwright/test'

const ROUTES = [
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

const BANNED_FONT_FRAGMENTS = ['Inter', 'Roboto', 'Arial', 'Helvetica', 'system-ui', '-apple-system']

for (const path of ROUTES) {
  test(`fixed palette and fonts on ${path}`, async ({ page }) => {
    await page.goto(path)
    const bodyStyles = await page.evaluate(() => {
      const body = getComputedStyle(document.body)
      return { background: body.backgroundColor, color: body.color }
    })
    expect(bodyStyles.background).toBe('rgb(242, 239, 231)')
    expect(bodyStyles.color).toBe('rgb(29, 33, 28)')

    const offenders = await page.evaluate((banned) => {
      const bad: string[] = []
      for (const el of document.querySelectorAll('body *')) {
        const family = getComputedStyle(el).fontFamily
        if (banned.some((fragment) => family.includes(fragment))) {
          bad.push(`${el.tagName.toLowerCase()}.${el.className || ''} → ${family.slice(0, 80)}`)
        }
      }
      return [...new Set(bad)]
    }, BANNED_FONT_FRAGMENTS)
    expect(offenders).toEqual([])
  })

  test(`no element escapes the viewport on ${path}`, async ({ page }) => {
    for (const viewport of [
      { width: 390, height: 844 },
      { width: 1440, height: 1000 },
    ]) {
      await page.setViewportSize(viewport)
      await page.goto(path)
      const escaping = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth
        const bad: string[] = []
        for (const el of document.querySelectorAll('body *')) {
          const rect = el.getBoundingClientRect()
          if (rect.width > 0 && (rect.left < -1 || rect.right > vw + 1)) {
            bad.push(`${el.tagName.toLowerCase()}.${el.className || ''} [${Math.round(rect.left)}, ${Math.round(rect.right)}]`)
          }
        }
        return [...new Set(bad)].slice(0, 10)
      })
      expect(escaping, `${path} at ${viewport.width}px`).toEqual([])
    }
  })
}

test('homepage editorial sections vary in column start, image ratio, or text measure', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')

  const sections = await page.evaluate(() => {
    // Only the top-level homepage sections, not nested component entries.
    const top = [...document.querySelectorAll('[data-editorial-section]')].filter(
      (el) => !el.parentElement?.closest('[data-editorial-section]'),
    )
    return top.map((el) => {
      const rect = el.getBoundingClientRect()
      const img = el.querySelector('img')
      const imgRatio = img ? rectOf(img).width / Math.max(1, rectOf(img).height) : null
      const textMeasure = maxTextWidth(el)
      return {
        left: Math.round(rect.left),
        width: Math.round(rect.width),
        imgRatio,
        textMeasure,
      }

      function rectOf(node: Element) {
        return node.getBoundingClientRect()
      }

      function maxTextWidth(root: Element): number | null {
        let best: number | null = null
        for (const node of root.querySelectorAll('p, h1, h2, h3, li, dd, span, a')) {
          if (!(node.textContent ?? '').trim()) continue
          const maxWidth = getComputedStyle(node).maxWidth
          if (maxWidth && maxWidth !== 'none') {
            const px = parseFloat(maxWidth)
            if (best === null || px < best) best = px
          }
        }
        return best
      }
    })
  })

  expect(sections.length).toBeGreaterThanOrEqual(6)

  for (let i = 1; i < sections.length; i++) {
    const prev = sections[i - 1]
    const curr = sections[i]
    const varies =
      Math.abs(prev.left - curr.left) > 2 ||
      Math.abs(prev.width - curr.width) > 24 ||
      ratiosDiffer(prev.imgRatio, curr.imgRatio) ||
      (prev.textMeasure !== null && curr.textMeasure !== null && prev.textMeasure !== curr.textMeasure)
    expect(
      varies,
      `section ${i} (index ${i}) does not vary from its predecessor: ${JSON.stringify({ prev, curr })}`,
    ).toBe(true)
  }

  function ratiosDiffer(a: number | null, b: number | null): boolean {
    if (a === null || b === null) return a !== b
    return Math.abs(a - b) > 0.05
  }
})

test('mobile menu toggle meets the 44px touch target', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const box = await page.locator('.mobile-nav__toggle').boundingBox()
  expect(box).not.toBeNull()
  expect(box!.height, 'toggle height').toBeGreaterThanOrEqual(44)
  expect(box!.width, 'toggle width').toBeGreaterThanOrEqual(44)
})
