const MINUTE_MS = 60_000

/** Idle logout window — override with AUTH_IDLE_MS (ms) for tests/manual. */
export function getIdleTimeoutMs(): number {
  const raw = process.env.AUTH_IDLE_MS
  if (raw && /^\d+$/.test(raw)) return Number(raw)
  return 30 * MINUTE_MS
}

export const RESET_TOKEN_TTL_MS = 60 * MINUTE_MS
export const PASSWORD_MIN_LENGTH = 8
export const FORGOT_PASSWORD_PATH = '/forgot-password'
export const RESET_PASSWORD_PATH = '/reset-password'
