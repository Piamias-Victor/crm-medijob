import { vi } from 'vitest'
import type { ApplicationDeps } from '@/server/routers/application.deps'

export function makeApplicationRouterDeps(
  overrides: Partial<ApplicationDeps> = {},
): ApplicationDeps {
  return {
    listInbox: vi.fn().mockResolvedValue([
      {
        id: 'a1',
        firstName: 'Paul',
        lastName: 'Martin',
        email: 'p@x.fr',
        phone: '0600000000',
        city: 'Lyon',
        cvUrl: null,
        message: 'Hello',
        createdAt: new Date(),
        jobTitle: null,
        jobOffer: { title: 'Offre' },
      },
    ]),
    getById: vi.fn().mockResolvedValue({
      id: 'a1',
      firstName: 'Paul',
      lastName: 'Martin',
      email: 'p@x.fr',
      phone: '0600000000',
      city: 'Lyon',
      cvUrl: null,
      message: 'Hello',
      createdAt: new Date(),
      jobTitle: { name: 'Pharmacien' },
      jobOffer: { id: 'o1', title: 'Offre' },
      status: 'EN_ATTENTE',
      boardSubmissionId: 'sub-1',
      jobTitleId: 'jt1',
      candidateId: null,
    }),
    detectDuplicate: vi.fn().mockResolvedValue(null),
    refuse: vi.fn().mockResolvedValue({ id: 'a1', status: 'REFUSEE' }),
    createProfile: vi.fn().mockResolvedValue({ id: 'c1' }),
    markAccepted: vi.fn(),
    findById: vi.fn().mockResolvedValue({
      id: 'a1',
      status: 'EN_ATTENTE',
      cvUrl: null,
    }),
    copyCvUrl: vi.fn().mockResolvedValue(null),
    listOwnedListingIds: vi.fn().mockResolvedValue([]),
    findByBoardSubmissionIds: vi.fn().mockResolvedValue([]),
    createFromIngest: vi.fn(),
    ...overrides,
  }
}
