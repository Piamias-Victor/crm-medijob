import { describe, expect, it, vi } from 'vitest'
import { makeLogAutomaticSend } from './log-automatic-send'

describe('makeLogAutomaticSend', () => {
  it('writes SMS ActivityLog on Candidate as Automatique', async () => {
    const createBatch = vi.fn().mockResolvedValue([])
    const log = makeLogAutomaticSend({
      ensureAuthor: async () => ({ id: 'auto-1' }),
      createBatch,
    })
    await log({
      type: 'SMS',
      content: 'SMS automatique — lien disponibilités',
      targets: [{ entityType: 'CANDIDATE', entityId: 'c1' }],
    })
    expect(createBatch).toHaveBeenCalledWith([
      {
        entityType: 'CANDIDATE',
        entityId: 'c1',
        authorId: 'auto-1',
        type: 'SMS',
        content: 'SMS automatique — lien disponibilités',
      },
    ])
  })

  it('writes EMAIL ActivityLog on Pharmacy and Contact', async () => {
    const createBatch = vi.fn().mockResolvedValue([])
    const log = makeLogAutomaticSend({
      ensureAuthor: async () => ({ id: 'auto-1' }),
      createBatch,
    })
    await log({
      type: 'EMAIL',
      content: 'Email automatique — candidature reçue',
      targets: [
        { entityType: 'PHARMACY', entityId: 'p1' },
        { entityType: 'CONTACT', entityId: 'ct1' },
      ],
    })
    expect(createBatch).toHaveBeenCalledWith([
      expect.objectContaining({ entityType: 'PHARMACY', entityId: 'p1', type: 'EMAIL' }),
      expect.objectContaining({ entityType: 'CONTACT', entityId: 'ct1', type: 'EMAIL' }),
    ])
  })

  it('skips when there is no CRM entity to attach', async () => {
    const createBatch = vi.fn()
    const log = makeLogAutomaticSend({
      ensureAuthor: async () => ({ id: 'auto-1' }),
      createBatch,
    })
    await log({ type: 'EMAIL', content: 'x', targets: [] })
    expect(createBatch).not.toHaveBeenCalled()
  })

  it('swallows create failures after a real send', async () => {
    const log = makeLogAutomaticSend({
      ensureAuthor: async () => ({ id: 'auto-1' }),
      createBatch: vi.fn().mockRejectedValue(new Error('db down')),
    })
    await expect(
      log({
        type: 'SMS',
        content: 'SMS automatique — missions ouvertes',
        targets: [{ entityType: 'CANDIDATE', entityId: 'c1' }],
      }),
    ).resolves.toBeUndefined()
  })
})
