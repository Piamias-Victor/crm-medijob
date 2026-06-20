// @vitest-environment node
import { vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeMissionRouter, type MissionDeps } from '@/server/routers/mission'

export const missionSession = {
  user: { id: 'u1', role: 'RECRUTEUR' as const },
  expires: '2999-01-01',
}

export const detailEntity = {
  id: 'm1',
  title: 'Titulaire CDI',
  description: null,
  contractType: 'CDI' as const,
  startDate: new Date('2026-03-01'),
  endDate: null,
  status: 'A_POURVOIR' as const,
  salaireMin: null,
  salaireMax: null,
  salaireNotes: null,
  heuresParSemaine: null,
  planning: null,
  tempsPlein: true,
  notes: null,
  pharmacyId: 'p1',
  contactId: null,
  referentId: 'u1',
  jobTitleId: 'jt1',
  updatedAt: new Date('2026-02-01'),
  pharmacy: { name: 'Pharmacie du Centre', city: 'Lyon' },
  jobTitle: { name: 'Pharmacien' },
  referent: { name: 'Réf Demo' },
  contact: null,
  candidates: [],
}

export function makeMissionDeps(overrides: Partial<MissionDeps> = {}): MissionDeps {
  return {
    list: vi.fn().mockResolvedValue([]),
    findDetailById: vi.fn().mockResolvedValue(detailEntity),
    update: vi.fn().mockResolvedValue(undefined),
    createQuick: vi.fn().mockResolvedValue({ id: 'm1', status: 'A_POURVOIR' }),
    createJobTitle: vi.fn().mockResolvedValue({ id: 'jt1', name: 'Préparateur' }),
    referentials: vi.fn().mockResolvedValue({ jobTitles: [], recruiters: [], pharmacies: [] }),
    updateStatus: vi.fn().mockResolvedValue({ id: 'm1', status: 'EN_RECHERCHE' }),
    ...overrides,
  }
}

export function missionCaller(deps: MissionDeps) {
  return createCallerFactory(makeMissionRouter(deps))({ session: missionSession })
}
