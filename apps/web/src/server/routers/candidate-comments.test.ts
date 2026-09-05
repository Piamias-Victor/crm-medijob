// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeCandidateRouter } from '@/server/routers/candidate'
import { makeCandidateDeps, session, profileFixture } from '@/server/routers/candidate.test.fixtures'

function caller(deps = makeCandidateDeps()) {
  return createCallerFactory(makeCandidateRouter(deps))({ session })
}

const comment = {
  id: 'c1',
  content: 'Répondeur : Entretien téléphonique.',
  authorName: 'Jensie Deslances',
  date: new Date('2026-03-12T14:32:00.000Z'),
}

describe('candidateRouter listComments', () => {
  it('lists Badakan comments for an App-origin Candidate', async () => {
    const getComments = vi.fn().mockResolvedValue([comment])
    const rows = await caller(
      makeCandidateDeps({
        findProfileById: vi.fn().mockResolvedValue({
          ...profileFixture,
          origin: 'APP',
          badakanId: 'tounkara-id',
        }),
        getComments,
      }),
    ).listComments({ id: 'c1' })
    expect(getComments).toHaveBeenCalledWith('tounkara-id')
    expect(rows[0]).toMatchObject({
      content: 'Répondeur : Entretien téléphonique.',
      authorName: 'Jensie Deslances',
    })
  })

  it('returns no comments when Candidate has no badakanId', async () => {
    const getComments = vi.fn()
    const rows = await caller(makeCandidateDeps({ getComments })).listComments({ id: 'c1' })
    expect(getComments).not.toHaveBeenCalled()
    expect(rows).toEqual([])
  })

  it('returns empty comments when Badakan read fails', async () => {
    const getComments = vi.fn().mockRejectedValue(new Error('missing env'))
    const rows = await caller(
      makeCandidateDeps({
        findProfileById: vi.fn().mockResolvedValue({
          ...profileFixture,
          origin: 'APP',
          badakanId: 'tounkara-id',
        }),
        getComments,
      }),
    ).listComments({ id: 'c1' })
    expect(rows).toEqual([])
  })
})
