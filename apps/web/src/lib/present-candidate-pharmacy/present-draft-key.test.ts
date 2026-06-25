import { describe, it, expect } from 'vitest'
import {
  acceptPresentDraftResponse,
  buildPresentDraftKey,
} from '@/lib/present-candidate-pharmacy/present-draft-key'

describe('present-draft-key', () => {
  it('builds a stable key from ids', () => {
    expect(buildPresentDraftKey('c1', 'p1', 'ct1')).toBe('c1:p1:ct1')
  })

  it('ignores stale draft responses', () => {
    const draft = { subject: 'Objet', body: 'Corps', to: 'a@b.com', contactId: 'ct1' }
    expect(acceptPresentDraftResponse('c1:p2:ct2', 'c1:p1:ct1', draft)).toBeNull()
    expect(acceptPresentDraftResponse('c1:p1:ct1', 'c1:p1:ct1', draft)).toEqual(draft)
  })
})
