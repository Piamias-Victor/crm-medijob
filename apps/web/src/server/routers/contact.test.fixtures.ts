import { vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeContactRouter, type ContactDeps } from '@/server/routers/contact'
import type { ContactListEntity } from '@/view-models/contact-list'
import type { ContactDetailEntity } from '@/view-models/contact-detail.types'

export const contactEntity: ContactListEntity = {
  id: 'c1',
  firstName: 'Marie',
  lastName: 'Curie',
  role: 'TITULAIRE',
  phone: null,
  email: 'marie@example.com',
  createdAt: new Date('2026-01-15'),
  pharmacy: { name: 'Pharmacie du Centre' },
}

export const contactDetailEntity: ContactDetailEntity = {
  id: 'c1',
  firstName: 'Marie',
  lastName: 'Curie',
  email: 'marie@example.com',
  phone: null,
  role: 'TITULAIRE',
  isPrimary: true,
  notes: null,
  pharmacyId: 'p1',
  updatedAt: new Date('2026-01-15'),
  pharmacy: { id: 'p1', name: 'Pharmacie du Centre' },
}

export const contactSession = {
  user: { id: 'u1', role: 'RECRUTEUR' as const },
  expires: '2999-01-01',
}

export function makeContactDeps(overrides: Partial<ContactDeps> = {}): ContactDeps {
  return {
    contacts: {
      list: vi.fn().mockResolvedValue([contactEntity]),
      findById: vi.fn().mockResolvedValue(contactDetailEntity),
      listByPharmacy: vi.fn().mockResolvedValue([]),
      listByPharmacyIds: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockImplementation((data) => Promise.resolve({ id: 'new', ...data })),
      update: vi.fn().mockResolvedValue({ id: 'c1' }),
      setPrimary: vi.fn().mockResolvedValue(contactDetailEntity),
      softDelete: vi.fn().mockResolvedValue({ id: 'c1' }),
    },
    listMissions: vi.fn().mockResolvedValue([]),
    pharmacies: {
      listForPicker: vi.fn().mockResolvedValue([{ id: 'p1', name: 'Pharmacie du Centre' }]),
    },
    ...overrides,
  }
}

export function contactCaller(deps: ContactDeps) {
  return createCallerFactory(makeContactRouter(deps))({ session: contactSession })
}
