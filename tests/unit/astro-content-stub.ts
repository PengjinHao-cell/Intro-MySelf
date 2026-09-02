// Test-only stand-in for the `astro:content` virtual module.
export function defineCollection<T>(config: T): T {
  return config
}
