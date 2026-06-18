import { vi } from 'vitest'
import type { UserDeps } from '@/server/routers/admin/user'

export const adminSession = { user: { id: 'u1', role: 'ADMIN' as const }, expires: '2999-01-01' }
export const recruteurSession = { user: { id: 'u2', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }

export const sampleUser = {
  id: 'u3',
  name: 'Jane Doe',
  email: 'jane@medijob.fr',
  role: 'RECRUTEUR' as const,
  createdAt: new Date('2026-01-15T10:00:00Z'),
}

export function makeUserDeps(overrides: Partial<UserDeps> = {}): UserDeps {
  return {
    list: vi.fn().mockResolvedValue([sampleUser]),
    create: vi.fn().mockResolvedValue(sampleUser),
    update: vi.fn().mockResolvedValue({ ...sampleUser, name: 'Jane Updated' }),
    remove: vi.fn().mockResolvedValue(undefined),
    countAdmins: vi.fn().mockResolvedValue(2),
    findById: vi.fn().mockResolvedValue(sampleUser),
    findByEmail: vi.fn().mockResolvedValue(null),
    hashPassword: vi.fn().mockResolvedValue('$argon2id$hash'),
    ...overrides,
  }
}
