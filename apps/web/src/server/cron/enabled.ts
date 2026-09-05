export const CRON_DISABLED_RESPONSE = { skipped: true as const, reason: 'cron_disabled' as const }

export function isCronEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.CRON_ENABLED?.trim() === 'true'
}
