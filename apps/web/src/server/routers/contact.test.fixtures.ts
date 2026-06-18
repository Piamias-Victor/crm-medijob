import { vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeContactRouter, type ContactDeps } from '@/server/routers/contact'
import type { ContactListEntity } from '@/view-models/contact-list'

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

export const contactSession = {
  user: { id: 'u1', role: 'RECRUTEUR' as const },
  expires: '2999-01-01',
}

export function makeContactDeps(overrides: Partial<ContactDeps> = {}): ContactDeps {
  return {
    contacts: {
      list: vi.fn().mockResolvedValue([contactEntity]),
      findById: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockImplementation((data) => Promise.resolve({ id: 'new', ...data })),
      update: vi.fn().mockResolvedValue({ id: 'c1' }),
      setPrimary: vi.fn().mockResolvedValue({ id: 'c1', isPrimary: true }),
      listMissions: vi.fn().mockResolvedValue([]),
      softDelete: vi.fn().mockResolvedValue({ id: 'c1' }),
    },
    pharmacies: {
      listForPicker: vi.fn().mockResolvedValue([{ id: 'p1', name: 'Pharmacie du Centre' }]),
    },
    ...overrides,
  }
}

export function contactCaller(deps: ContactDeps) {
  return createCallerFactory(makeContactRouter(deps))({ session: contactSession })
}
