import { getCollection } from 'astro:content'
import { validateRelations } from '../domain/relations'
import type { ContentRef } from '../domain/types'

/** The minimal view of a related entry needed to render a link. */
export type RelatedTarget = {
  id: string
  collection: string
  data: { title?: string; publishedAt: Date }
}

/** All published related-content collections, keyed by `collection/id`. */
export async function contentMap() {
  const [moments, writing, projects, photos] = await Promise.all([
    getCollection('moments'),
    getCollection('writing'),
    getCollection('projects'),
    getCollection('photos'),
  ])

  const byKey = new Map<string, RelatedTarget>()
  const keys = new Set<string>()
  for (const entry of [...moments, ...writing, ...projects, ...photos]) {
    if (entry.data.draft) continue
    const key = `${entry.collection}/${entry.id}`
    keys.add(key)
    byKey.set(key, {
      id: entry.id,
      collection: entry.collection,
      data: { title: 'title' in entry.data ? entry.data.title : undefined, publishedAt: entry.data.publishedAt },
    })
  }

  return { byKey, keys }
}

/** Fail the build on broken references; return the resolved entries. */
export function assertValidRelated(
  refs: ContentRef[] | undefined,
  keys: Set<string>,
  owner: string,
): ContentRef[] {
  const issues = validateRelations(refs ?? [], keys)
  if (issues.length > 0) {
    throw new Error(
      `Invalid related-content reference in ${owner}: ${issues.map((i) => i.message).join('; ')}`,
    )
  }
  return refs ?? []
}
