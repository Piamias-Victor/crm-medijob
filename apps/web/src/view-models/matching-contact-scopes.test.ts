// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { matchingContactScopes } from '@/view-models/matching-contact-scopes'

describe('matchingContactScopes', () => {
  it('scopes mission + selected candidates', () => {
    expect(matchingContactScopes('m1', ['c1', 'c2'])).toEqual([
      { entityType: 'MISSION', entityId: 'm1' },
      { entityType: 'CANDIDATE', entityId: 'c1' },
      { entityType: 'CANDIDATE', entityId: 'c2' },
    ])
  })
})
