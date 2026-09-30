import type { CandidateStatus, PrismaClient } from '@prisma/client'
import { decideEventStamp, QUALIFIE_TARGETS } from '@/view-models/activite-event-stamp'

export async function setCandidateQualifieWithStamp(
  db: PrismaClient,
  candidateId: string,
  now: Date = new Date(),
) {
  const row = await db.candidate.findUnique({
    where: { id: candidateId },
    select: { status: true, qualifiedAt: true },
  })
  const qualifiedAt = decideEventStamp({
    previous: row?.status,
    next: 'QUALIFIE',
    targets: QUALIFIE_TARGETS,
    existing: row?.qualifiedAt,
    now,
  })
  return db.candidate.update({
    where: { id: candidateId },
    data: { status: 'QUALIFIE' satisfies CandidateStatus, statusBeforeInactive: null, qualifiedAt },
  })
}
