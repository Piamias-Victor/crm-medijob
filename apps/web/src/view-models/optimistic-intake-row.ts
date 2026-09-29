import { isRelanceOverdue } from '@/view-models/app-profile-relance'
import type { AppProfileListItem } from '@/view-models/app-profile-list'
import type { AppCallOutcome } from '@/view-models/app-profile-intake.enums'
import { APP_INTAKE_STATUS_LABELS } from '@/view-models/app-profile-intake.labels'
import type { AppIntakeStatus } from '@/view-models/app-profile-intake.enums'

type Patch = {
  intakeStatus?: string
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
  const intakeStatus = patch.intakeStatus ?? row.intakeStatus
  const statusChanged = intakeStatus !== row.intakeStatus
  return {
    ...row,
    intakeStatus,
    intakeStatusName: statusChanged
      ? (APP_INTAKE_STATUS_LABELS[intakeStatus as AppIntakeStatus] ?? intakeStatus)
      : row.intakeStatusName,
    callOutcome: patch.callOutcome !== undefined ? patch.callOutcome : row.callOutcome,
    plannedRdvAt: patch.plannedRdvAt !== undefined ? patch.plannedRdvAt : row.plannedRdvAt,
    notes: patch.notes !== undefined ? patch.notes : row.notes,
    referentId: patch.referentId !== undefined ? patch.referentId : row.referentId,
    relanceAt,
    isRelanceOverdue: isRelanceOverdue(relanceAt, now),
  }
}
