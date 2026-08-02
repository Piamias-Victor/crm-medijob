import { vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { mockProvider } from '@/server/ai/mock-provider'
import type { UserRole } from '@/server/auth/permissions'
import { makeJobOfferRouter, type JobOfferDeps } from '@/server/routers/job-offer'

type TestSession = { user: { id: string; role: UserRole }; expires: string }

export const session: TestSession = {
  user: { id: 'u1', role: 'RECRUTEUR' },
  expires: '2999-01-01',
}
export const directionSession: TestSession = {
  user: { id: 'u2', role: 'DIRECTION' },
  expires: '2999-01-01',
}

export const missionContext = {
  id: 'm1',
  title: 'CDI Pharmacien Lyon',
  description: 'Officine de quartier',
  contractType: 'CDI' as const,
  startDate: new Date('2026-09-01'),
  planning: 'Lun-Ven',
  salaireMin: 3500,
  salaireMax: 4200,
  salaireNotes: null,
  heuresParSemaine: 35,
  profilRecherche: 'Expérience officine',
  notes: null,
  jobTitle: { name: 'Pharmacien' },
  pharmacy: {
    name: 'Pharmacie du Parc',
    city: 'Lyon',
    notes: 'Bonne ambiance',
    software: { name: 'Winpharma' },
  },
}

export function makeDeps(overrides: Partial<JobOfferDeps> = {}): JobOfferDeps {
  return {
    list: vi.fn().mockResolvedValue([]),
    getById: vi.fn().mockResolvedValue(null),
    findByMissionId: vi.fn().mockResolvedValue(null),
    findMissionForOffer: vi.fn().mockResolvedValue(missionContext),
    create: vi.fn().mockImplementation(async (data) => ({
      id: 'o1',
      missionId: data.mission.connect?.id ?? 'm1',
      title: data.title,
      content: data.content,
      status: 'BROUILLON',
      publishedAt: null,
      webflowItemId: null,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    update: vi.fn().mockImplementation(async (id, data) => ({
      id,
      missionId: 'm1',
      title: data.title ?? 't',
      content: data.content ?? 'c'.repeat(100),
      status: data.status ?? 'BROUILLON',
      publishedAt: data.publishedAt ?? null,
      webflowItemId: null,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    softDelete: vi.fn().mockResolvedValue({ id: 'o1' }),
    provider: mockProvider,
    ...overrides,
  }
}

export function caller(deps: JobOfferDeps, sess: TestSession = session) {
  return createCallerFactory(makeJobOfferRouter(deps))({ session: sess })
}
