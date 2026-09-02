// Test-only stand-in for the `astro/loaders` module.
export function glob(options: Record<string, unknown>): Record<string, unknown> {
  return { type: 'glob', ...options }
}
