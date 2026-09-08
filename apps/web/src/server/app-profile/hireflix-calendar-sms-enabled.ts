export type HireflixCalendarSmsEnv = {
  VERCEL_ENV?: string
  HIREFLIX_CALENDAR_SMS?: string
  [key: string]: string | undefined
}

export function isHireflixCalendarSmsEnabled(
  env: HireflixCalendarSmsEnv = process.env,
): boolean {
  if (env.VERCEL_ENV === 'production') return false
  return env.HIREFLIX_CALENDAR_SMS?.trim() === 'true'
}
