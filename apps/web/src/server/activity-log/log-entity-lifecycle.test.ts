// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { makeLogEntityLifecycle } from '@/server/activity-log/log-entity-lifecycle'

describe('makeLogEntityLifecycle', () => {
  it('writes NOTE « Fiche créée » on created action', async () => {
    const create = vi.fn().mockResolvedValue({})
    const log = makeLogEntityLifecycle(create)
    await log({
      action: 'created',
      entityType: 'PHARMACY',
      entityId: 'p1',
      user: { id: 'u1', name: 'Ada Lovelace' },
    })
    expect(create).toHaveBeenCalledWith({
      entityType: 'PHARMACY',
      entityId: 'p1',
      authorId: 'u1',
      type: 'NOTE',
      content: 'Fiche créée',
    })
  })

  it('writes « Fiche modifiée par [name] » on updated action', async () => {
    const create = vi.fn().mockResolvedValue({})
    const log = makeLogEntityLifecycle(create)
    await log({
      action: 'updated',
      entityType: 'CONTACT',
      entityId: 'c1',
      user: { id: 'u1', name: 'Ada Lovelace' },
    })
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        content: 'Fiche modifiée par Ada Lovelace',
        type: 'NOTE',
        authorId: 'u1',
      }),
    )
  })

  it('falls back to email then Utilisateur for update label', async () => {
    const create = vi.fn().mockResolvedValue({})
    const log = makeLogEntityLifecycle(create)
    await log({
      action: 'updated',
      entityType: 'MISSION',
      entityId: 'm1',
      user: { id: 'u1', email: 'ada@example.com' },
    })
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ content: 'Fiche modifiée par ada@example.com' }),
    )
    await log({
      action: 'updated',
      entityType: 'MISSION',
      entityId: 'm1',
      user: { id: 'u1' },
    })
    expect(create).toHaveBeenLastCalledWith(
      expect.objectContaining({ content: 'Fiche modifiée par Utilisateur' }),
    )
  })

  it('swallows create failures (best-effort)', async () => {
    const create = vi.fn().mockRejectedValue(new Error('db down'))
    const log = makeLogEntityLifecycle(create)
    await expect(
      log({
        action: 'created',
        entityType: 'CANDIDATE',
        entityId: 'c1',
        user: { id: 'u1', name: 'Ada' },
      }),
    ).resolves.toBeUndefined()
  })
})
