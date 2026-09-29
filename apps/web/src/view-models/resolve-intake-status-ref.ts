import { DEFAULT_APP_INTAKE_STATUS_ID } from './app-profile-intake.enums'
import { APP_INTAKE_STATUS_LABELS } from './app-profile-intake.labels'
import type { AppIntakeStatus } from './app-profile-intake.enums'

export type IntakeStatusRef = { id: string; name: string; color: string }

const DEFAULT_COLOR = '#FEF3C7'

export function resolveIntakeStatusRef(input: {
  intakeStatusId?: string | null
  intakeStatus?: IntakeStatusRef | string | null
}): IntakeStatusRef {
  if (input.intakeStatus && typeof input.intakeStatus === 'object') {
    return input.intakeStatus
  }
  const id =
    (typeof input.intakeStatus === 'string' ? input.intakeStatus : null) ??
    input.intakeStatusId ??
    DEFAULT_APP_INTAKE_STATUS_ID
  const seeded = id as AppIntakeStatus
  return {
    id,
    name: APP_INTAKE_STATUS_LABELS[seeded] ?? id,
    color: DEFAULT_COLOR,
  }
}
