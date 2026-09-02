import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
  resolve: {
    alias: {
      // Astro virtual modules are not available under Vitest; stub them so
      // `src/content.config.ts` can be imported and its Zod schemas tested.
      'astro:content': fileURLToPath(new URL('./tests/unit/astro-content-stub.ts', import.meta.url)),
      'astro/loaders': fileURLToPath(new URL('./tests/unit/astro-loaders-stub.ts', import.meta.url)),
    },
  },
})
