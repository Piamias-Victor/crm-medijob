import { createCallerFactory } from '@/server/trpc'
import { makeDevisRouter, type DevisDeps } from '@/server/routers/devis'
import type { SendDevisActivity } from '@/server/devis/send-devis'
import type { DevisRecord } from '@/view-models/devis'
import type { DevisMissionRef } from '@/view-models/devis-mission-ref'
import type { UserRole } from '@/server/auth/permissions'

export const cddDraft = {
  missionId: 'm1',
  kind: 'CDD' as const,
  hours: null,
  hourlyRate: null,
  amountHt: 3000,
  htSource: 'TYPED' as const,
}

export const recruiterSession = {
  user: { id: 'u1', role: 'RECRUTEUR' as UserRole },
  expires: '2999-01-01',
}

const mission: DevisMissionRef = {
  id: 'm1',
  title: 'Remplacement titulaire',
  pharmacyId: 'p1',
  pharmacyName: 'Pharmacie du Centre',
  contact: { firstName: 'Marie', lastName: 'Curie', email: 'marie@pharma.fr' },
}

export type InMemoryDevisDeps = DevisDeps & { activities: SendDevisActivity[] }

export function makeInMemoryDevisDeps(): InMemoryDevisDeps {
  const store: DevisRecord[] = []
  const activities: SendDevisActivity[] = []
  return {
    findMission: async (id) => (id === 'm1' ? mission : null),
    findDraftByMission: async (missionId) =>
      store.find((row) => row.missionId === missionId && row.status === 'DRAFT') ?? null,
    createDraft: async (data) => {
      const row: DevisRecord = {
        ...data,
        id: `d${store.length + 1}`,
        status: 'DRAFT',
        sentAt: null,
        updatedAt: new Date('2026-08-19'),
      }
      store.push(row)
      return row
    },
    markSent: async (id) => {
      const row = store.find((item) => item.id === id)
      if (!row) return null
      const sentCount = store.filter((item) => item.sentAt).length
      row.status = 'SENT'
      row.sentAt = new Date(Date.parse('2026-08-20T00:00:00Z') + sentCount * 1000)
      return row
    },
    listByMission: async (missionId) => store.filter((row) => row.missionId === missionId),
    updateDraft: async (id, data) => {
      const row = store.find((item) => item.id === id)
      if (!row) return null
      Object.assign(row, data, { updatedAt: new Date('2026-08-19') })
      return row
    },
    softDeleteDraft: async (id) => {
      const index = store.findIndex((item) => item.id === id && item.status === 'DRAFT')
      if (index < 0) return null
      const [row] = store.splice(index, 1)
      return row ?? null
    },
    renderPdf: async () => Buffer.from('%PDF-fake'),
    uploadBlob: async () => ({ url: 'https://blob.example/devis.pdf' }),
    createDocument: async (data) => ({ id: 'doc1', url: data.url }),
    findPrimaryContact: async () => null,
    logActivity: async (input) => {
      activities.push(input)
    },
    activities,
  }
}

export function devisCaller(deps: DevisDeps, role: UserRole = 'RECRUTEUR') {
  return createCallerFactory(makeDevisRouter(deps))({
    session: { user: { id: 'u1', role }, expires: recruiterSession.expires },
  })
}
