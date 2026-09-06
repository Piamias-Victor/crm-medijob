import { makeDefaultResetDeps } from './reset-password.deps'
import { sendInviteAccessEmail } from './send-reset-email'
import type { InviteAccessDeps } from './invite-access'

export function makeDefaultInviteAccessDeps(
  overrides: Partial<InviteAccessDeps> = {},
): InviteAccessDeps {
  const reset = makeDefaultResetDeps()
  return {
    deleteTokensForEmail: reset.deleteTokensForEmail,
    createToken: reset.createToken,
    hashToken: reset.hashToken,
    createRawToken: reset.createRawToken,
    sendResetEmail: reset.sendResetEmail,
    sendInviteEmail: sendInviteAccessEmail,
    resetTokenTtlMs: reset.resetTokenTtlMs,
    appBaseUrl: reset.appBaseUrl,
    now: reset.now,
    ...overrides,
  }
}
