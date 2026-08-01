import { TRPCError } from '@trpc/server'
import { RESET_PASSWORD_PATH } from './constants'
import type {
  ConfirmPasswordResetInput,
  RequestPasswordResetInput,
} from './reset-schema'

export type ResetTokenRow = {
  identifier: string
  token: string
  expires: Date
}

export type ResetPasswordDeps = {
  findToken: (hashedToken: string) => Promise<ResetTokenRow | null>
  deleteToken: (row: Pick<ResetTokenRow, 'identifier' | 'token'>) => Promise<void>
  deleteTokensForEmail: (email: string) => Promise<void>
  createToken: (row: ResetTokenRow) => Promise<void>
  findUserByEmail: (email: string) => Promise<{ id: string } | null>
  updatePassword: (userId: string, hashed: string) => Promise<void>
  hashPassword: (plain: string) => Promise<string>
  hashToken: (raw: string) => string
  createRawToken: () => string
  sendResetEmail: (input: { email: string; resetUrl: string }) => Promise<void>
  resetTokenTtlMs: number
  appBaseUrl: string
  now: () => Date
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export async function requestPasswordReset(
  input: RequestPasswordResetInput,
  deps: ResetPasswordDeps,
): Promise<{ ok: true }> {
  const email = normalizeEmail(input.email)
  const user = await deps.findUserByEmail(email)
  if (!user) return { ok: true }

  const raw = deps.createRawToken()
  const expires = new Date(deps.now().getTime() + deps.resetTokenTtlMs)
  await deps.deleteTokensForEmail(email)
  await deps.createToken({
    identifier: email,
    token: deps.hashToken(raw),
    expires,
  })
  const resetUrl = `${deps.appBaseUrl}${RESET_PASSWORD_PATH}?token=${encodeURIComponent(raw)}`
  await deps.sendResetEmail({ email, resetUrl })
  return { ok: true }
}

export async function confirmPasswordReset(
  input: ConfirmPasswordResetInput,
  deps: ResetPasswordDeps,
): Promise<{ ok: true }> {
  const hashedToken = deps.hashToken(input.token)
  const row = await deps.findToken(hashedToken)
  if (!row || row.expires.getTime() <= deps.now().getTime()) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Lien invalide ou expiré' })
  }

  const user = await deps.findUserByEmail(row.identifier)
  if (!user) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Lien invalide ou expiré' })
  }

  const password = await deps.hashPassword(input.password)
  await deps.updatePassword(user.id, password)
  await deps.deleteToken({ identifier: row.identifier, token: row.token })
  return { ok: true }
}
