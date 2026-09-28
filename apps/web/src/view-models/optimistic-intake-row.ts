import { isRelanceOverdue } from '@/view-models/app-profile-relance'
import type { AppProfileListItem } from '@/view-models/app-profile-list'
import type { AppCallOutcome, AppIntakeStatus } from '@/view-models/app-profile-intake.enums'

type Patch = {
  intakeStatus?: AppIntakeStatus
  callOutcome?: AppCallOutcome | null
  plannedRdvAt?: Date | null
  notes?: string | null
  referentId?: string | null
  relanceAt?: Date | null
}

export function optimisticIntakeRow(
  row: AppProfileListItem,
  patch: Patch,
  now: Date = new Date(),
): AppProfileListItem {
  const relanceAt = patch.relanceAt !== undefined ? patch.relanceAt : row.relanceAt
  return {
    ...row,
    intakeStatus: patch.intakeStatus ?? row.intakeStatus,
    callOutcome: patch.callOutcome !== undefined ? patch.callOutcome : row.callOutcome,
    plannedRdvAt: patch.plannedRdvAt !== undefined ? patch.plannedRdvAt : row.plannedRdvAt,
    notes: patch.notes !== undefined ? patch.notes : row.notes,
    referentId: patch.referentId !== undefined ? patch.referentId : row.referentId,
    relanceAt,
    isRelanceOverdue: isRelanceOverdue(relanceAt, now),
  }
}
