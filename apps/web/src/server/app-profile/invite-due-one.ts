import type { InviteDueDeps, InviteDueProfile } from './invite-due.types'

async function stillPending(id: string, deps: InviteDueDeps) {
  const live = await deps.findById(id)
  return live != null && live.status !== 'IGNORE'
}

export async function inviteOneAppProfile(
  row: InviteDueProfile,
  deps: InviteDueDeps,
): Promise<'sent' | 'skippedNoEmail' | 'cancelled'> {
  const to = deps.testTo ?? row.email
  if (!to) return 'skippedNoEmail'
  if (!(await stillPending(row.id, deps))) return 'cancelled'

  await deps.sendInviteEmail({
    to,
    firstName: row.firstName,
  })
  if (!deps.testTo) await deps.saveSent(row.id)
  return 'sent'
}
