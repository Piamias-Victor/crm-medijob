import { vi } from 'vitest'
import type { ResetPasswordDeps } from './reset-password'

export function makeResetDeps(
  overrides: Partial<ResetPasswordDeps> = {},
): ResetPasswordDeps {
  return {
    findToken: vi.fn(),
    deleteToken: vi.fn(),
    deleteTokensForEmail: vi.fn(),
    createToken: vi.fn(),
    findUserByEmail: vi.fn(),
    updatePassword: vi.fn(),
    hashPassword: vi.fn(async (p) => `hashed:${p}`),
    hashToken: (t) => `tok:${t}`,
    createRawToken: () => 'raw-token',
    sendResetEmail: vi.fn(),
    resetTokenTtlMs: 3_600_000,
    appBaseUrl: 'http://localhost:3000',
    now: () => new Date('2026-08-01T12:00:00.000Z'),
    ...overrides,
  }
}

export const validTokenRow = {
  identifier: 'user@medijob.fr',
  token: 'tok:raw-token',
  expires: new Date('2026-08-01T13:00:00.000Z'),
}
