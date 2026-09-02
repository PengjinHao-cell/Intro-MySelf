import { describe, expect, it } from 'vitest'
import { newestFirst, onlyPublished } from '../../src/domain/content'

type Entry = { id: string; data: { draft: boolean; publishedAt: Date } }

const drafts: Entry[] = [
  { id: 'draft-b', data: { draft: true, publishedAt: new Date('2026-09-01') } },
  { id: 'published-new', data: { draft: false, publishedAt: new Date('2026-09-02') } },
  { id: 'draft-a', data: { draft: true, publishedAt: new Date('2026-08-01') } },
  { id: 'published-old', data: { draft: false, publishedAt: new Date('2026-08-02') } },
]

describe('onlyPublished', () => {
  it('removes draft entries', () => {
    const result = onlyPublished(drafts)
    expect(result.map((e) => e.id)).toEqual(['published-new', 'published-old'])
  })

  it('does not mutate the input array', () => {
    const input = [...drafts]
    onlyPublished(input)
    expect(input).toEqual(drafts)
  })
})

describe('newestFirst', () => {
  it('sorts entries by publishedAt descending', () => {
    const result = newestFirst(onlyPublished(drafts))
    expect(result.map((e) => e.id)).toEqual(['published-new', 'published-old'])
  })

  it('does not mutate the input array', () => {
    const input = [...drafts]
    newestFirst(input)
    expect(input).toEqual(drafts)
  })
})
