import { collection, config, fields, singleton } from '@keystatic/core'

/**
 * Local Keystatic editor. Collections write into `src/content/*`, the same
 * files Astro reads, so the browser editor and direct file editing share one
 * content source. Rich bodies are the MDX document body (`contentField`).
 */

const draft = fields.checkbox({
  label: 'Draft',
  description: 'Drafts stay out of public pages, RSS, and the sitemap.',
  defaultValue: true,
})

const publishedAt = fields.date({
  label: 'Published',
  validation: { isRequired: true },
})

const image = fields.object({
  src: fields.text({ label: 'Image path', validation: { isRequired: true } }),
  alt: fields.text({ label: 'Alternative text', validation: { isRequired: true } }),
  width: fields.integer({ label: 'Width (px)', description: 'Reserves space to avoid layout shift.' }),
  height: fields.integer({ label: 'Height (px)' }),
})

const images = fields.array(image, {
  label: 'Images',
  itemLabel: (props) => props.fields.src.value || 'Image',
})

const related = fields.array(
  fields.object({
    collection: fields.select({
      label: 'Collection',
      options: [
        { label: 'Moments', value: 'moments' },
        { label: 'Writing', value: 'writing' },
        { label: 'Projects', value: 'projects' },
        { label: 'Photos', value: 'photos' },
      ],
      defaultValue: 'moments',
    }),
    id: fields.text({ label: 'Entry id', validation: { isRequired: true } }),
  }),
  { label: 'Related content', itemLabel: (props) => props.fields.id.value || 'Relation' },
)

export default config({
  storage: { kind: 'local' },
  // Local mode reads and writes real files relative to the process cwd,
  // which is the project root when `npm run dev` runs from here.
  ui: {
    navigation: {
      Moments: ['moments'],
      Writing: ['writing'],
      Projects: ['projects'],
      'Photo Stories': ['photos'],
      Timeline: ['timeline'],
      'Site Settings': ['settings'],
    },
  },
  collections: {
    moments: collection({
      label: 'Moments',
      path: 'src/content/moments/*',
      slugField: 'name',
      format: { data: 'yaml', contentField: 'body' },
      columns: ['publishedAt', 'city'],
      schema: {
        name: fields.slug({
          name: {
            label: 'Name',
            description: 'File name, shown nowhere publicly.',
            validation: { isRequired: true },
          },
        }),
        body: fields.mdx({ label: 'Body' }),
        publishedAt,
        city: fields.text({ label: 'City', description: 'City-level only; no exact locations.' }),
        images,
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.value || 'Tag',
        }),
        related,
        draft,
      },
    }),
    writing: collection({
      label: 'Writing',
      path: 'src/content/writing/*',
      slugField: 'name',
      format: { data: 'yaml', contentField: 'body' },
      columns: ['type', 'publishedAt'],
      schema: {
        name: fields.slug({
          name: {
            label: 'Name',
            description: 'File name, shown nowhere publicly.',
            validation: { isRequired: true },
          },
        }),
        title: fields.text({ label: 'Title', validation: { isRequired: true } }),
        body: fields.mdx({ label: 'Body' }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        cover: image,
        type: fields.select({
          label: 'Type',
          options: [
            { label: 'Article', value: 'article' },
            { label: 'Note', value: 'note' },
          ],
          defaultValue: 'note',
        }),
        topics: fields.array(fields.text({ label: 'Topic' }), {
          label: 'Topics',
          itemLabel: (props) => props.value || 'Topic',
        }),
        publishedAt,
        readingMinutes: fields.integer({
          label: 'Reading minutes',
          validation: { min: 1 },
        }),
        related,
        draft,
      },
    }),
    projects: collection({
      label: 'Projects',
      path: 'src/content/projects/*',
      slugField: 'name',
      format: { data: 'yaml', contentField: 'body' },
      columns: ['category', 'status'],
      schema: {
        name: fields.slug({
          name: {
            label: 'Name',
            description: 'File name, shown nowhere publicly.',
            validation: { isRequired: true },
          },
        }),
        title: fields.text({ label: 'Title', validation: { isRequired: true } }),
        body: fields.mdx({ label: 'Overview' }),
        publishedAt,
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Computer Vision', value: 'Computer Vision' },
            { label: 'Deep Learning', value: 'Deep Learning' },
            { label: 'Robotics', value: 'Robotics' },
            { label: 'Software', value: 'Software' },
          ],
          defaultValue: 'Computer Vision',
        }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Planned', value: 'planned' },
            { label: 'Active', value: 'active' },
            { label: 'Completed', value: 'completed' },
            { label: 'Archived', value: 'archived' },
          ],
          defaultValue: 'planned',
        }),
        technologies: fields.array(fields.text({ label: 'Technology' }), {
          label: 'Technologies',
          itemLabel: (props) => props.value || 'Technology',
        }),
        startDate: fields.date({ label: 'Start date' }),
        endDate: fields.date({ label: 'End date' }),
        results: fields.array(fields.text({ label: 'Result' }), {
          label: 'Key results',
          itemLabel: (props) => props.value || 'Result',
        }),
        question: fields.text({ label: 'Question', multiline: true }),
        process: fields.text({ label: 'Process', multiline: true }),
        learning: fields.text({ label: 'What I learned', multiline: true }),
        cover: image,
        repository: fields.url({ label: 'Repository URL' }),
        featured: fields.checkbox({ label: 'Featured on homepage', defaultValue: false }),
        draft,
      },
    }),
    photos: collection({
      label: 'Photo Stories',
      path: 'src/content/photos/*',
      slugField: 'name',
      format: { data: 'yaml', contentField: 'body' },
      columns: ['category', 'city'],
      schema: {
        name: fields.slug({
          name: {
            label: 'Name',
            description: 'File name, shown nowhere publicly.',
            validation: { isRequired: true },
          },
        }),
        title: fields.text({ label: 'Title', validation: { isRequired: true } }),
        body: fields.mdx({ label: 'Story' }),
        publishedAt,
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Landscape', value: 'Landscape' },
            { label: 'City', value: 'City' },
            { label: 'People', value: 'People' },
            { label: 'Experiment', value: 'Experiment' },
          ],
          defaultValue: 'City',
        }),
        images,
        city: fields.text({ label: 'City', description: 'City-level only; no exact coordinates.' }),
        camera: fields.text({ label: 'Camera' }),
        lens: fields.text({ label: 'Lens' }),
        explanation: fields.text({ label: 'Explanation', multiline: true }),
        order: fields.integer({ label: 'Order' }),
        draft,
      },
    }),
  },
  singletons: {
    timeline: singleton({
      label: 'Timeline',
      path: 'src/content/timeline/2026',
      format: { data: 'json' },
      schema: {
        year: fields.integer({ label: 'Year', validation: { isRequired: true } }),
        items: fields.array(
          fields.object({
            date: fields.date({ label: 'Date', validation: { isRequired: true } }),
            title: fields.text({ label: 'Title', validation: { isRequired: true } }),
            summary: fields.text({ label: 'Summary', multiline: true, validation: { isRequired: true } }),
          }),
          { label: 'Items', itemLabel: (props) => props.fields.title.value || 'Item' },
        ),
      },
    }),
    settings: singleton({
      label: 'Site Settings',
      path: 'src/content/settings/site',
      format: { data: 'json' },
      schema: {
        displayName: fields.text({ label: 'Display name', validation: { isRequired: true } }),
        intro: fields.text({ label: 'Short introduction', multiline: true, validation: { isRequired: true } }),
        now: fields.object({
          month: fields.text({ label: 'Month' }),
          learning: fields.text({ label: 'Learning' }),
          building: fields.text({ label: 'Building' }),
          reading: fields.text({ label: 'Reading' }),
          location: fields.text({ label: 'Location', description: 'City-level only.' }),
        }),
        social: fields.array(
          fields.object({
            label: fields.text({ label: 'Label', validation: { isRequired: true } }),
            url: fields.url({ label: 'URL', validation: { isRequired: true } }),
          }),
          { label: 'Social links', itemLabel: (props) => props.fields.label.value || 'Link' },
        ),
        homepage: fields.object({
          selectedProjects: fields.array(fields.text({ label: 'Project id' }), {
            label: 'Selected projects',
            itemLabel: (props) => props.value || 'Project',
          }),
          selectedPhotos: fields.array(fields.text({ label: 'Photo id' }), {
            label: 'Selected photos',
            itemLabel: (props) => props.value || 'Photo',
          }),
        }),
      },
    }),
  },
})
