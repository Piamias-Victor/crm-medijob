import { RESET_PASSWORD_PATH } from './constants'
import type { ResetPasswordDeps } from './reset-password'

export type InviteAccessDeps = Pick<
  ResetPasswordDeps,
  | 'deleteTokensForEmail'
  | 'createToken'
  | 'hashToken'
  | 'createRawToken'
  | 'sendResetEmail'
  | 'resetTokenTtlMs'
  | 'appBaseUrl'
  | 'now'
> & {
  sendInviteEmail: ResetPasswordDeps['sendResetEmail']
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/** Creates a password-setup token and emails the invite link (reuses /reset-password). */
export async function sendAccessInvite(
  emailInput: string,
  deps: InviteAccessDeps,
): Promise<{ ok: true }> {
  const email = normalizeEmail(emailInput)
  const raw = deps.createRawToken()
  const expires = new Date(deps.now().getTime() + deps.resetTokenTtlMs)
  await deps.deleteTokensForEmail(email)
  await deps.createToken({
    identifier: email,
    token: deps.hashToken(raw),
    expires,
  })
  const resetUrl = `${deps.appBaseUrl}${RESET_PASSWORD_PATH}?token=${encodeURIComponent(raw)}`
  await deps.sendInviteEmail({ email, resetUrl })
  return { ok: true }
}
