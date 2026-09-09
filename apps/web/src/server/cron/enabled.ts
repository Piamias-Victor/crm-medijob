export const CRON_DISABLED_RESPONSE = { skipped: true as const, reason: 'cron_disabled' as const }

export type CronEnv = { CRON_ENABLED?: string; NODE_ENV?: string }

export function isCronEnabled(env: CronEnv = process.env): boolean {
  return env.CRON_ENABLED?.trim() === 'true'
}
