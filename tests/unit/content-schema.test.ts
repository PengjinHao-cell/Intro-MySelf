import { describe, expect, it } from 'vitest'
import { momentSchema, photoSchema, projectSchema } from '../../src/content.config'

describe('content schemas', () => {
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
