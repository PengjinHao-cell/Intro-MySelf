/**
 * Public-content query helpers. Kept independent of Astro so they can be
 * tested without the content runtime.
 */

/** Keep only entries that are not drafts, without mutating the input. */
export function onlyPublished<T extends { data: { draft: boolean } }>(entries: T[]): T[] {
  return entries.filter((entry) => !entry.data.draft)
}

/** Order entries by publishedAt descending, without mutating the input. */
export function newestFirst<T extends { data: { publishedAt: Date } }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime())
}
