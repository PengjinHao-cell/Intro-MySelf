import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { momentSchema, photoSchema, projectSchema } from '../../src/content.config'

describe('content schemas', () => {
  it('uses the blank-paper placeholder for every bundled sample image', () => {
    const sampleFiles = [
      'src/content/photos/city-light.mdx',
      'src/content/moments/evening-window.mdx',
      'src/content/moments/first-reproduction.mdx',
      'src/content/writing/validation-loss.mdx',
      'src/content/projects/mini-deepid.mdx',
    ]

    for (const sampleFile of sampleFiles) {
      const content = readFileSync(new URL(`../../${sampleFile}`, import.meta.url), 'utf8')
      const imageSources = [...content.matchAll(/^\s+(?:-\s+)?src:\s+(.+)$/gm)].map(
        (match) => match[1],
      )

      expect(imageSources.length, `${sampleFile} should contain a sample image`).toBeGreaterThan(0)
      expect(imageSources, sampleFile).toEqual(
        new Array(imageSources.length).fill('/images/placeholders/blank-paper.svg'),
      )
    }
  })

  it('accepts a minimal valid moment', () => {
    expect(
      momentSchema.safeParse({ body: 'test', publishedAt: new Date(), draft: false, images: [] })
        .success,
    ).toBe(true)
  })

  it('rejects a moment with more than nine images', () => {
    expect(
      momentSchema.safeParse({
        body: 'test',
        publishedAt: new Date(),
        draft: false,
        images: new Array(10).fill({ src: '/x.jpg', alt: 'x' }),
      }).success,
    ).toBe(false)
  })

  it('rejects a photo whose image has empty alternative text', () => {
    expect(
      photoSchema.safeParse({
        title: 'City light',
        publishedAt: new Date(),
        draft: false,
        category: 'City',
        images: [{ src: '/x.jpg', alt: '' }],
      }).success,
    ).toBe(false)
  })

  it('accepts a completed computer vision project', () => {
    expect(
      projectSchema.safeParse({
        title: 'Mini DeepID',
        publishedAt: new Date(),
        draft: false,
        category: 'Computer Vision',
        status: 'completed',
      }).success,
    ).toBe(true)
  })
})
