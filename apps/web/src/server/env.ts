export function getAuthSecret() {
  return process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET
}

/** Node/server only — do not call from middleware (Edge has a partial process.env). */
export function validateServerEnv() {
  if (process.env.NODE_ENV !== 'production') return
  const secret = getAuthSecret()
  if (!secret?.trim()) {
    throw new Error('AUTH_SECRET or NEXTAUTH_SECRET is required in production')
  }
}
