import { MS_PER_DAY, OVERDUE_FOLLOWUP_DAYS } from '@/lib/constants/dashboard-alerts'

export function overdueFollowUpCutoff(
  now: Date,
  days = OVERDUE_FOLLOWUP_DAYS,
): Date {
  return new Date(now.getTime() - days * MS_PER_DAY)
}

/** Dernier toucher = dernier ActivityLog.date, sinon createdAt mission. */
export function isOverdueFollowUp(
  mission: { createdAt: Date; lastActivityAt: Date | null },
  cutoff: Date,
): boolean {
  const lastTouch = mission.lastActivityAt ?? mission.createdAt
  return lastTouch < cutoff
}
