import { createCallerFactory } from '@/server/trpc'
import { makeDevisRouter, type DevisDeps } from '@/server/routers/devis'
import type { DevisRecord } from '@/view-models/devis'
import type { UserRole } from '@/server/auth/permissions'

export const recruiterSession = {
  user: { id: 'u1', role: 'RECRUTEUR' as UserRole },
  expires: '2999-01-01',
}

export function makeInMemoryDevisDeps(): DevisDeps {
  const store: DevisRecord[] = []
  return {
    findMission: async (id) => (id === 'm1' ? { id: 'm1', contractType: 'CDD' } : null),
    findDraftByMission: async (missionId) =>
      store.find((row) => row.missionId === missionId && row.status === 'DRAFT') ?? null,
    createDraft: async (data) => {
      const row: DevisRecord = {
        ...data,
        id: 'd1',
        status: 'DRAFT',
        updatedAt: new Date('2026-08-19'),
      }
      store.push(row)
      return row
    },
    updateDraft: async (id, data) => {
      const row = store.find((item) => item.id === id)
      if (!row) return null
      Object.assign(row, data, { updatedAt: new Date('2026-08-19') })
      return row
    },
  }
}

export function devisCaller(deps: DevisDeps, role: UserRole = 'RECRUTEUR') {
  return createCallerFactory(makeDevisRouter(deps))({
    session: { user: { id: 'u1', role }, expires: recruiterSession.expires },
  })
}
