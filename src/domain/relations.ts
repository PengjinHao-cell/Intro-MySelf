import type { ContentRef, RelationIssue } from './types'

const keyFor = (ref: ContentRef): string => `${ref.collection}/${ref.id}`

/**
 * Validate related-content references against the set of available keys
 * (`collection/id`). Returns one issue per missing reference.
 */
export function validateRelations(refs: ContentRef[], available: Set<string>): RelationIssue[] {
  const issues: RelationIssue[] = []
  for (const ref of refs) {
    if (!available.has(keyFor(ref))) {
      issues.push({ ref, message: `Missing related content: ${keyFor(ref)}` })
    }
  }
  return issues
}
