export function isCronAuthorized(
  header: string | null,
  secret = process.env.CRON_SECRET,
) {
  return Boolean(secret) && header === `Bearer ${secret}`
}
