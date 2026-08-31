export const BADAKAN_INACTIVE_STATUSES = ['SUSPENDED', 'BANNED'] as const
export const BADAKAN_EMPLOYEE_STATUSES = [
  'CREATED',
  'COMPLETED',
  ...BADAKAN_INACTIVE_STATUSES,
] as const

export type BadakanEmployeeStatus = (typeof BADAKAN_EMPLOYEE_STATUSES)[number]

const KNOWN = new Set<string>(BADAKAN_EMPLOYEE_STATUSES)

export function mapBadakanEmployeeStatus(
  raw: string | null | undefined,
): BadakanEmployeeStatus | null {
  if (!raw) return null
  const status = raw.trim().toUpperCase()
  return KNOWN.has(status) ? (status as BadakanEmployeeStatus) : null
}

export function isBadakanInactive(
  status: BadakanEmployeeStatus | null,
): boolean {
  return status === 'SUSPENDED' || status === 'BANNED'
}
