import { describe, expect, it, vi } from 'vitest'
import { syncApplications } from './sync'
import type { BoardApplication } from '@/server/job-board/applications-port'

const owned = 'listing-1'

function row(overrides: Partial<BoardApplication> = {}): BoardApplication {
  return {
    id: 'sub-1',
    offre_id: owned,
    prenom: 'Léa',
    nom: 'Martin',
    email: 'lea@site.fr',
    telephone: '0600000001',
    ville: 'Lyon',
    cv_url: 'https://board.example/cv.pdf',
    message: 'Motivée',
    created_at: '2026-08-01T10:00:00.000Z',
    ...overrides,
  }
}

describe('syncApplications', () => {
  it('creates a pending Application for a submission on an owned listing', async () => {
    const createPending = vi.fn()
    const result = await syncApplications({
      listSubmissions: async () => [row()],
      listOwnedListingIds: async () => [owned],
      findByBoardSubmissionIds: async () => [],
      createPending,
    })
    expect(result).toEqual({ fetched: 1, created: 1, skipped: 0 })
    expect(createPending).toHaveBeenCalledTimes(1)
    expect(createPending.mock.calls[0]?.[0]).toMatchObject({
      boardSubmissionId: 'sub-1',
      firstName: 'Léa',
      lastName: 'Martin',
      email: 'lea@site.fr',
      phone: '0600000001',
      city: 'Lyon',
      cvUrl: 'https://board.example/cv.pdf',
      message: 'Motivée',
      boardListingId: owned,
    })
  })

  it('does not duplicate a board submission id already stored', async () => {
    const createPending = vi.fn()
    const result = await syncApplications({
      listSubmissions: async () => [row()],
      listOwnedListingIds: async () => [owned],
      findByBoardSubmissionIds: async () => [{ boardSubmissionId: 'sub-1' }],
      createPending,
    })
    expect(result).toEqual({ fetched: 1, created: 0, skipped: 1 })
    expect(createPending).not.toHaveBeenCalled()
  })

  it('skips spontaneous rows without offre_id', async () => {
    const createPending = vi.fn()
    await syncApplications({
      listSubmissions: async () => [row({ offre_id: null })],
      listOwnedListingIds: async () => [owned],
      findByBoardSubmissionIds: async () => [],
      createPending,
    })
    expect(createPending).not.toHaveBeenCalled()
  })

  it('skips submissions whose listing id is not owned by the CRM', async () => {
    const createPending = vi.fn()
    await syncApplications({
      listSubmissions: async () => [row({ offre_id: 'legacy-t4s' })],
      listOwnedListingIds: async () => [owned],
      findByBoardSubmissionIds: async () => [],
      createPending,
    })
    expect(createPending).not.toHaveBeenCalled()
  })
})
