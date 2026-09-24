import type { AppCallOutcome, AppIntakeStatus } from '@prisma/client'
import { defaultRelanceAfterCall } from './app-profile-relance'

export type IntakeStampInput = {
  intakeStatus: AppIntakeStatus
  callOutcome: AppCallOutcome | null
  plannedRdvAt: Date | null
  notes: string | null
  referentId: string | null
  relanceAt: Date | null
}

export type IntakeStampResult = IntakeStampInput & {
  lastCalledAt?: Date
  lastCalledById?: string
}

export function buildIntakeStampUpdate(args: {
  input: IntakeStampInput
  previousCallOutcome: AppCallOutcome | null
  sessionUserId: string
  now: Date
}): IntakeStampResult {
  const { input, previousCallOutcome, sessionUserId, now } = args
  const outcomeChanged = input.callOutcome !== previousCallOutcome
  if (!outcomeChanged || input.callOutcome == null) {
    return { ...input }
  }
  return {
    ...input,
    lastCalledAt: now,
    lastCalledById: sessionUserId,
    relanceAt: defaultRelanceAfterCall(now),
  }
}
