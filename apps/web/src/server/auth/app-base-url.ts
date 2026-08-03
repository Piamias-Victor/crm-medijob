export function getAppBaseUrl(): string {
  const fromEnv = process.env.NEXTAUTH_URL ?? process.env.AUTH_URL
  if (fromEnv?.trim()) return fromEnv.replace(/\/$/, '')
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}
