import { describe, expect, it, vi } from 'vitest'
import { applyMissionTerminalTransition } from './mission-terminal-transition'

const now = new Date('2026-09-15T12:00:00.000Z')

describe('applyMissionTerminalTransition', () => {
  it('stamps pourvuAt on EN_RECHERCHE → POURVU', async () => {
    const update = vi.fn().mockResolvedValue({ id: 'm1', status: 'POURVU', pourvuAt: now })
    const tx = {
      mission: {
        findUnique: vi.fn().mockResolvedValue({ status: 'EN_RECHERCHE', pourvuAt: null }),
        update,
      },
      missionCandidate: { update: vi.fn() },
    }
    const db = { $transaction: (fn: (t: typeof tx) => unknown) => fn(tx) }
    await applyMissionTerminalTransition(db as never, 'm1', 'POURVU', [], now)
    expect(update.mock.calls[0][0].data.pourvuAt).toEqual(now)
  })

  it('keeps pourvuAt on rollback away from POURVU', async () => {
    const earlier = new Date('2026-08-01T00:00:00.000Z')
    const update = vi.fn().mockResolvedValue({ id: 'm1', status: 'ANNULEE', pourvuAt: earlier })
    const tx = {
      mission: {
        findUnique: vi.fn().mockResolvedValue({ status: 'POURVU', pourvuAt: earlier }),
        update,
      },
      missionCandidate: { update: vi.fn() },
    }
    const db = { $transaction: (fn: (t: typeof tx) => unknown) => fn(tx) }
    await applyMissionTerminalTransition(db as never, 'm1', 'ANNULEE', [], now)
    expect(update.mock.calls[0][0].data.pourvuAt).toEqual(earlier)
  })
})
