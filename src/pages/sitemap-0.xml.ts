import { getCollection } from 'astro:content'
import { onlyPublished } from '../domain/content'

const SITE = 'http://127.0.0.1:4321'

/** Static route inventory: drafts never produce routes, so they are absent. */
export async function GET() {
  const urls = ['/', '/moments', '/writing', '/work', '/photos', '/about']

  const collections = [
    { collection: 'moments', prefix: '/moments' },
    { collection: 'writing', prefix: '/writing' },
    { collection: 'projects', prefix: '/work' },
    { collection: 'photos', prefix: '/photos' },
  ] as const

  for (const { collection, prefix } of collections) {
    const entries = onlyPublished(await getCollection(collection))
    for (const entry of entries) {
      urls.push(`${prefix}/${entry.id}`)
    }
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((url) => `  <url>\n    <loc>${SITE}${url}</loc>\n  </url>`)
    .join('\n')}\n</urlset>`

  return new Response(body, { headers: { 'Content-Type': 'application/xml' } })
}
