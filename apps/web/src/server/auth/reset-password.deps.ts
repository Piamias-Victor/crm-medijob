import { userRepository } from '@/server/db/repositories/user.repository'
import { verificationTokenRepository } from '@/server/db/repositories/verification-token.repository'
import { hashPassword } from './password'
import { createRawToken, hashToken } from './hash-token'
import { sendResetEmail } from './send-reset-email'
import { getAppBaseUrl } from './app-base-url'
import { RESET_TOKEN_TTL_MS } from './constants'
import type { ResetPasswordDeps } from './reset-password'

export function makeDefaultResetDeps(
  overrides: Partial<ResetPasswordDeps> = {},
): ResetPasswordDeps {
  return {
    findToken: (token) => verificationTokenRepository.findByToken(token),
    deleteToken: async (row) => {
      await verificationTokenRepository.delete(row)
    },
    deleteTokensForEmail: async (email) => {
      await verificationTokenRepository.deleteAllForIdentifier(email)
    },
    createToken: async (row) => {
      await verificationTokenRepository.create(row)
    },
    findUserByEmail: (email) => userRepository.findActiveIdByEmailInsensitive(email),
    updatePassword: async (userId, hashed) => {
      await userRepository.updatePassword(userId, hashed)
    },
    hashPassword,
    hashToken,
    createRawToken,
    sendResetEmail,
    resetTokenTtlMs: RESET_TOKEN_TTL_MS,
    appBaseUrl: getAppBaseUrl(),
    now: () => new Date(),
    ...overrides,
  }
}
