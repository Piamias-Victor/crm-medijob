import { describe, expect, it, vi } from 'vitest'
import { setCandidateQualifieWithStamp } from './candidate-qualify-stamp'

const now = new Date('2026-09-15T12:00:00.000Z')

describe('setCandidateQualifieWithStamp', () => {
  it('stamps on NOUVEAU → QUALIFIE', async () => {
    const update = vi.fn().mockResolvedValue({})
    const db = {
      candidate: {
        findUnique: vi.fn().mockResolvedValue({ status: 'NOUVEAU', qualifiedAt: null }),
        update,
      },
    }
    await setCandidateQualifieWithStamp(db as never, 'c1', now)
    expect(update).toHaveBeenCalledWith({
      where: { id: 'c1' },
      data: { status: 'QUALIFIE', statusBeforeInactive: null, qualifiedAt: now },
    })
  })

  it('keeps stamp when already QUALIFIE', async () => {
    const earlier = new Date('2026-08-01T00:00:00.000Z')
    const update = vi.fn().mockResolvedValue({})
    const db = {
      candidate: {
        findUnique: vi.fn().mockResolvedValue({ status: 'QUALIFIE', qualifiedAt: earlier }),
        update,
      },
    }
    await setCandidateQualifieWithStamp(db as never, 'c1', now)
    expect(update.mock.calls[0][0].data.qualifiedAt).toEqual(earlier)
  })
})
