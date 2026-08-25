import type { InviteDueDeps, InviteDueProfile } from './invite-due.types'

async function stillPending(id: string, deps: InviteDueDeps) {
  const live = await deps.findById(id)
  return live?.status === 'EN_ATTENTE'
}

export async function inviteOneAppProfile(
  row: InviteDueProfile,
  deps: InviteDueDeps,
): Promise<'sent' | 'skippedNoEmail' | 'cancelled'> {
  const to = deps.testTo ?? row.email
  if (!to) return 'skippedNoEmail'
  if (!(await stillPending(row.id, deps))) return 'cancelled'

  const hf = row.hireflixUrl && row.hireflixInterviewId
    ? { interviewId: row.hireflixInterviewId, url: row.hireflixUrl }
    : await deps.inviteHireflix({
        firstName: row.firstName,
        lastName: row.lastName,
        email: to,
        externalId: row.id,
      })
  if (!row.hireflixUrl && !deps.testTo) {
    await deps.saveHireflix(row.id, { interviewId: hf.interviewId, url: hf.url })
  }
  if (!(await stillPending(row.id, deps))) return 'cancelled'

  await deps.sendInviteEmail({
    to,
    firstName: row.firstName,
    url: hf.url,
  })
  if (!deps.testTo) await deps.saveSent(row.id)
  return 'sent'
}
