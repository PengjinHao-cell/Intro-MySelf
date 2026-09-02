import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'zod'

/**
 * Shared content schemas for the personal digital garden.
 *
 * Rich bodies live in the MDX document body (Keystatic writes them there via
 * `format.contentField`), so the `body` fields below are optional in the
 * frontmatter schema: the loader exposes the document body separately.
 */

const draft = z.boolean().default(true)

export const imageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
})

export const contentRefSchema = z.object({
  collection: z.enum(['moments', 'writing', 'projects', 'photos']),
  id: z.string().min(1),
})

/** Moment: low-pressure entry for photos, learning progress, observations. */
export const momentSchema = z.object({
  name: z.string().optional(),
  body: z.string().optional(),
  publishedAt: z.coerce.date(),
  city: z.string().optional(),
  images: z.array(imageSchema).max(9).optional(),
  tags: z.array(z.string()).optional(),
  related: z.array(contentRefSchema).optional(),
  draft,
})

/** Writing: long-form Article or focused learning Note. */
export const writingSchema = z.object({
  name: z.string().optional(),
  title: z.string().min(1),
  body: z.string().optional(),
  summary: z.string().optional(),
  cover: imageSchema.optional(),
  type: z.enum(['article', 'note']),
  topics: z.array(z.string()).optional(),
  publishedAt: z.coerce.date(),
  readingMinutes: z.number().int().positive().optional(),
  related: z.array(contentRefSchema).optional(),
  draft,
})

/** Project: consistent narrative from question to result. */
export const projectSchema = z.object({
  name: z.string().optional(),
  title: z.string().min(1),
  body: z.string().optional(),
  publishedAt: z.coerce.date(),
  category: z.enum(['Computer Vision', 'Deep Learning', 'Robotics', 'Software']),
  status: z.enum(['planned', 'active', 'completed', 'archived']),
  technologies: z.array(z.string()).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  results: z.array(z.string()).optional(),
  question: z.string().optional(),
  process: z.string().optional(),
  learning: z.string().optional(),
  cover: imageSchema.optional(),
  repository: z.url().optional(),
  featured: z.boolean().optional(),
  draft,
})

/** Photo: curated photograph or photo story. */
export const photoSchema = z.object({
  name: z.string().optional(),
  title: z.string().min(1),
  body: z.string().optional(),
  publishedAt: z.coerce.date(),
  category: z.enum(['Landscape', 'City', 'People', 'Experiment']),
  images: z.array(imageSchema).min(1),
  city: z.string().optional(),
  camera: z.string().optional(),
  lens: z.string().optional(),
  explanation: z.string().optional(),
  order: z.number().optional(),
  draft,
})

/** Timeline: one file per year with ordered milestone items. */
export const timelineSchema = z.object({
  year: z.number(),
  items: z.array(
    z.object({
      date: z.coerce.date(),
      title: z.string().min(1),
      summary: z.string(),
    }),
  ),
})

/** Settings: site identity, Now fields, social links, homepage selections. */
export const settingsSchema = z.object({
  displayName: z.string(),
  intro: z.string(),
  now: z
    .object({
      month: z.string().optional(),
      learning: z.string().optional(),
      building: z.string().optional(),
      reading: z.string().optional(),
      location: z.string().optional(),
    })
    .optional(),
  social: z.array(z.object({ label: z.string(), url: z.url() })).optional(),
  homepage: z
    .object({
      selectedProjects: z.array(z.string()).optional(),
      selectedPhotos: z.array(z.string()).optional(),
    })
    .optional(),
})

export const collections = {
  moments: defineCollection({
    loader: glob({ pattern: '**/*.mdx', base: './src/content/moments' }),
    schema: momentSchema,
  }),
  writing: defineCollection({
    loader: glob({ pattern: '**/*.mdx', base: './src/content/writing' }),
    schema: writingSchema,
  }),
  projects: defineCollection({
    loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
    schema: projectSchema,
  }),
  photos: defineCollection({
    loader: glob({ pattern: '**/*.mdx', base: './src/content/photos' }),
    schema: photoSchema,
  }),
  timeline: defineCollection({
    loader: glob({ pattern: '*.json', base: './src/content/timeline' }),
    schema: timelineSchema,
  }),
  settings: defineCollection({
    loader: glob({ pattern: 'site.json', base: './src/content/settings' }),
    schema: settingsSchema,
  }),
}
