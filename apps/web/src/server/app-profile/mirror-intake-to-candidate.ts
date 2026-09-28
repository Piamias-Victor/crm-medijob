import type { ActivityType } from '@prisma/client'
import {
  buildIntakeMirrorActivities,
  type IntakeMirrorSnapshot,
} from '@/view-models/app-profile-intake-mirror'

export type MirrorIntakeDeps = {
  logActivity: (input: {
    entityType: 'CANDIDATE'
    entityId: string
    authorId: string
    type: ActivityType
    content: string
  }) => Promise<unknown>
  updateCandidateReferent: (id: string, referentId: string | null) => Promise<unknown>
}

export async function mirrorIntakeToCandidate(
  deps: MirrorIntakeDeps,
  input: {
    candidateId: string
    authorId: string
    previous: IntakeMirrorSnapshot
    next: IntakeMirrorSnapshot
  },
) {
  if (previousReferentChanged(input.previous, input.next)) {
    await deps.updateCandidateReferent(input.candidateId, input.next.referentId)
  }
  const logs = buildIntakeMirrorActivities(input.previous, input.next)
  for (const log of logs) {
    await deps.logActivity({
      entityType: 'CANDIDATE',
      entityId: input.candidateId,
      authorId: input.authorId,
      type: log.type,
      content: log.content,
    })
  }
}

function previousReferentChanged(previous: IntakeMirrorSnapshot, next: IntakeMirrorSnapshot) {
  return previous.referentId !== next.referentId
}
