// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeBadakanProposalRouter, type BadakanProposalDeps } from './badakan-proposal'

const session = { user: { id: 'u1', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }

const proposalRow = {
  id: 'p1',
  badakanMissionId: 'm1',
  candidateId: 'c1',
  status: 'PROPOSE' as const,
  score: 88,
  justification: 'Dispo + même ville',
  candidate: {
    id: 'c1',
    firstName: 'Emma',
    lastName: 'Six',
    email: 'emma@ex.com',
    phone: '0600000000',
    city: 'Cagnes-sur-Mer',
    jobTitle: { name: 'Pharmacien' },
  },
}

function deps(overrides: Partial<BadakanProposalDeps> = {}): BadakanProposalDeps {
  return {
    propose: vi.fn().mockResolvedValue(proposalRow),
    listByMission: vi.fn().mockResolvedValue([proposalRow]),
    listByCandidate: vi.fn().mockResolvedValue([]),
    setStatus: vi.fn().mockResolvedValue({ ...proposalRow, status: 'VALIDE' }),
    remove: vi.fn().mockResolvedValue({ id: 'p1' }),
    ...overrides,
  }
}

function caller(d: BadakanProposalDeps = deps()) {
  return createCallerFactory(makeBadakanProposalRouter(d))({ session })
}

describe('badakanProposalRouter', () => {
  it('proposes a candidate on a Badakan mission and lists them as Proposé', async () => {
    const propose = vi.fn().mockResolvedValue(proposalRow)
    const listByMission = vi.fn().mockResolvedValue([proposalRow])
    const api = caller(deps({ propose, listByMission }))

    const created = await api.propose({
      missionId: 'm1',
      candidateId: 'c1',
      score: 88,
      justification: 'Dispo + même ville',
    })
    expect(propose).toHaveBeenCalledWith({
      missionId: 'm1',
      candidateId: 'c1',
      score: 88,
      justification: 'Dispo + même ville',
    })
    expect(created).toMatchObject({
      candidateId: 'c1',
      fullName: 'Emma Six',
      status: 'PROPOSE',
      statusLabel: 'Proposé',
    })

    const listed = await api.listByMission({ missionId: 'm1' })
    expect(listByMission).toHaveBeenCalledWith('m1')
    expect(listed[0]).toMatchObject({ fullName: 'Emma Six', statusLabel: 'Proposé' })
  })

  it('marks the Badakan mission as staffed when a proposal is validated', async () => {
    const setStatus = vi.fn().mockResolvedValue({ ...proposalRow, status: 'VALIDE' })
    await caller(deps({ setStatus })).setStatus({
      missionId: 'm1',
      candidateId: 'c1',
      status: 'VALIDE',
    })
    expect(setStatus).toHaveBeenCalledWith({
      missionId: 'm1',
      candidateId: 'c1',
      status: 'VALIDE',
    })
  })

  it('removes a proposal from the Badakan mission', async () => {
    const remove = vi.fn().mockResolvedValue({ id: 'p1' })
    await caller(deps({ remove })).remove({ missionId: 'm1', candidateId: 'c1' })
    expect(remove).toHaveBeenCalledWith({ missionId: 'm1', candidateId: 'c1' })
  })
})
