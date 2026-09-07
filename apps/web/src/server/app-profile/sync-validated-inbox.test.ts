import { describe, expect, it, vi } from 'vitest'
import { mapBadakanRecipient } from '@/server/badakan/map-recipient'
import type { InboxRevertDeps } from './sync-validated-inbox'
import { returnNotValidatedToInbox } from './sync-validated-inbox'

const row = mapBadakanRecipient({
  id: 'bk-marie',
  firstName: 'Marie',
  lastName: 'App',
  isValid: false,
})!

function inboxDeps(overrides: Partial<InboxRevertDeps> = {}): InboxRevertDeps {
  return {
    findAppProfileByBadakanId: async () => ({
      id: 'p1',
      status: 'APP_VALIDATED',
      candidateId: 'c1',
    }),
    restorePending: vi.fn(),
    upsertInbox: vi.fn(),
    softDeleteCandidate: vi.fn(),
    unlinkAppOrigin: vi.fn(),
    ...overrides,
  }
}

describe('returnNotValidatedToInbox', () => {
  it('restores Profils app and soft-deletes origin App Candidate', async () => {
    const deps = inboxDeps()
    await returnNotValidatedToInbox(
      row,
      { id: 'c1', origin: 'APP', status: 'NOUVEAU', statusBeforeInactive: null },
      deps,
    )
    expect(deps.restorePending).toHaveBeenCalledWith('p1')
    expect(deps.softDeleteCandidate).toHaveBeenCalledWith('c1')
    expect(deps.unlinkAppOrigin).not.toHaveBeenCalled()
  })

  it('unlinks a CRM Candidate instead of deleting it', async () => {
    const deps = inboxDeps()
    await returnNotValidatedToInbox(
      row,
      { id: 'c-crm', origin: 'CRM', status: 'QUALIFIE', statusBeforeInactive: null },
      deps,
    )
    expect(deps.unlinkAppOrigin).toHaveBeenCalledWith('c-crm')
    expect(deps.softDeleteCandidate).not.toHaveBeenCalled()
  })

  it('creates a pending AppProfile when none exists', async () => {
    const deps = inboxDeps({ findAppProfileByBadakanId: async () => null })
    await returnNotValidatedToInbox(row, null, deps)
    expect(deps.upsertInbox).toHaveBeenCalledWith(
      expect.objectContaining({ badakanId: 'bk-marie', firstName: 'Marie' }),
    )
    expect(deps.restorePending).not.toHaveBeenCalled()
  })
})
