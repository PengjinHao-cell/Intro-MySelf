import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { newestFirst, onlyPublished } from '../domain/content'

const SITE = 'http://127.0.0.1:4321'

export async function GET(context: { site: URL | undefined }) {
  const moments = onlyPublished(await getCollection('moments'))
  const writing = onlyPublished(await getCollection('writing'))

  const items = newestFirst([...moments, ...writing]).map((entry) => {
    const date = entry.data.publishedAt.toISOString().slice(0, 10)
    const isWriting = entry.collection === 'writing'
    const title = isWriting
      ? (entry.data.title as string)
      : `Moment — ${date}`
    return {
      title,
      description: entry.body?.slice(0, 200) ?? '',
      pubDate: entry.data.publishedAt,
      link: `/${isWriting ? 'writing' : 'moments'}/${entry.id}`,
    }
  })

  return rss({
    title: 'Personal Digital Garden',
    description: 'Photography, computer vision, and learning notes.',
    site: context.site ?? SITE,
    items,
    stylesheet: undefined,
  })
}
