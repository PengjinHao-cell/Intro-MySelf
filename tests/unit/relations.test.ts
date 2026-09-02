import { describe, expect, it } from 'vitest'
import { validateRelations } from '../../src/domain/relations'

describe('validateRelations', () => {
  it('reports a missing related entry', () => {
    expect(validateRelations([{ collection: 'projects', id: 'missing' }], new Set())).toEqual([
      { ref: { collection: 'projects', id: 'missing' }, message: 'Missing related content: projects/missing' },
    ])
  })

  it('accepts a related entry whose key exists', () => {
    expect(
      validateRelations([{ collection: 'projects', id: 'mini-deepid' }], new Set(['projects/mini-deepid'])),
    ).toEqual([])
  })
})
