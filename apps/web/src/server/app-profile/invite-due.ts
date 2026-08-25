import { inviteOneAppProfile } from './invite-due-one'
import type { InviteDueDeps, InviteDueResult } from './invite-due.types'

export async function inviteDueAppProfiles(
  deps: InviteDueDeps,
): Promise<InviteDueResult> {
  const due = await deps.listDue()
  const rows = deps.testTo ? due.filter((row) => row.email).slice(0, 1) : due
  const result: InviteDueResult = {
    sent: 0,
    skippedNoEmail: 0,
    cancelled: 0,
    failed: 0,
  }
  for (const row of rows) {
    try {
      const outcome = await inviteOneAppProfile(row, deps)
      result[outcome] += 1
    } catch (error) {
      const message = error instanceof Error ? error.message : 'invite failed'
      if (!deps.testTo) await deps.saveError(row.id, message)
      result.failed += 1
      result.lastError = message
    }
  }
  return result
}
