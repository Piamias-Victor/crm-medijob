import { describe, expect, it } from 'vitest'
import { TRPCError } from '@trpc/server'
import { makeActiviteRouter } from './activite'
import type { ActiviteOverview } from '@/view-models/activite-overview'

const empty: ActiviteOverview = {
  fromYmd: '2026-03-01',
  toYmd: '2026-03-30',
  counts: {
    candidatesCrm: 0,
    candidatesApp: 0,
    appValidated: 0,
    qualifies: 0,
    applications: 0,
    missionsCreated: 0,
    missionsFilled: 0,
    badakanCreated: 0,
    badakanStaffed: 0,
  },
  entrants: [],
  missions: [],
}

function caller(role: 'DIRECTION' | 'RECRUTEUR') {
  const router = makeActiviteRouter({ getOverview: async () => empty })
  return router.createCaller({
    session: { user: { id: 'u1', role, email: 'a@b.c', name: 'A' }, expires: '2099' },
  })
}

describe('activiteRouter', () => {
  it('forbids recruteur', async () => {
    await expect(caller('RECRUTEUR').overview({})).rejects.toBeInstanceOf(TRPCError)
  })

  it('allows Direction', async () => {
    await expect(caller('DIRECTION').overview({})).resolves.toMatchObject({ fromYmd: '2026-03-01' })
  })
})
