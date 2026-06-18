import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Session } from 'next-auth'

const updateStage = vi.fn()

vi.mock('@/server/db/repositories/mission-candidate.repository', () => ({
  missionCandidateRepository: {
    updateStage: (input: unknown) => updateStage(input),
  },
}))

import { appRouter } from '@/server/routers/_app'
import { createCallerFactory } from '@/server/trpc'

const session: Session = {
  user: { id: 'u1', role: 'RECRUTEUR' },
  expires: '2099-01-01T00:00:00.000Z',
}

const authedCaller = () => createCallerFactory(appRouter)({ session })
const anonCaller = () => createCallerFactory(appRouter)({ session: null })

const input = { missionId: 'm1', candidateId: 'c1', stageId: 's2' }

beforeEach(() => updateStage.mockReset())

describe('missionCandidate.updateStage', () => {
  it('moves a single MissionCandidate to the target stage', async () => {
    updateStage.mockResolvedValue({ ...input })

    const result = await authedCaller().missionCandidate.updateStage(input)

    expect(updateStage).toHaveBeenCalledWith(input)
    expect(result).toEqual(input)
  })

  it('rejects unauthenticated callers', async () => {
    await expect(anonCaller().missionCandidate.updateStage(input)).rejects.toThrow()
    expect(updateStage).not.toHaveBeenCalled()
  })

  it('rejects input missing identifiers', async () => {
    await expect(
      authedCaller().missionCandidate.updateStage({
        missionId: '',
        candidateId: 'c1',
        stageId: 's2',
      }),
    ).rejects.toThrow()
    expect(updateStage).not.toHaveBeenCalled()
  })
})
