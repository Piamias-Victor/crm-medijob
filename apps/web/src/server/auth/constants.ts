const MINUTE_MS = 60_000

/** Session / idle window. Default 24 h. Override with AUTH_IDLE_MS (ms). */
type IdleEnv = { AUTH_IDLE_MS?: string }

export function getIdleTimeoutMs(env: IdleEnv = process.env as IdleEnv): number {
  const raw = env.AUTH_IDLE_MS
  if (raw && /^\d+$/.test(raw)) return Number(raw)
  return 24 * 60 * MINUTE_MS
}

export const RESET_TOKEN_TTL_MS = 60 * MINUTE_MS
export const PASSWORD_MIN_LENGTH = 8
export const FORGOT_PASSWORD_PATH = '/forgot-password'
export const RESET_PASSWORD_PATH = '/reset-password'
