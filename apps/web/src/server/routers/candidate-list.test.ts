// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeCandidateRouter } from '@/server/routers/candidate'
import { makeCandidateDeps, session } from '@/server/routers/candidate.test.fixtures'

function caller(deps = makeCandidateDeps()) {
  return createCallerFactory(makeCandidateRouter(deps))({ session })
}

describe('candidateRouter list', () => {
  it('retourne rows + stages sans dupliquer candidates bruts', async () => {
    const result = await caller().list()
    expect(result).not.toHaveProperty('candidates')
    expect(result.rows[0]).toHaveProperty('missions')
    expect(result.stages).toEqual([{ id: 's1', name: 'Nouveau' }])
  })

  it('returns typed list source rows for the CVthèque', async () => {
    const deps = makeCandidateDeps()
    const result = await caller(deps).list()
    expect(result.rows).toHaveLength(1)
    expect(result.rows[0]).toMatchObject({ id: 'c1', firstName: 'Camille', city: 'Lyon' })
  })

  it('forwards list filters to repository', async () => {
    const deps = makeCandidateDeps()
    await caller(deps).list({ jobTitleIds: ['jt1'], departments: ['69'] })
    expect(deps.listForKanban).toHaveBeenCalledWith({ jobTitleIds: ['jt1'], departments: ['69'] })
  })
})
