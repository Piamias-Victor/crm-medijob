import type { CandidateStatus } from '@prisma/client'
import { AppProfileError } from './accept'

export { AppProfileError }

const QUALIFIABLE = new Set(['EN_ATTENTE', 'APP_VALIDATED'])

export type QualifyDeps = {
  findById: (id: string) => Promise<{
    id: string
    status: string
    candidateId: string | null
    candidate?: { status: CandidateStatus } | null
  } | null>
  setCandidateQualifie: (candidateId: string) => Promise<unknown>
}

export async function qualifyAppProfile(id: string, deps: QualifyDeps) {
  const row = await deps.findById(id)
  if (!row) throw new AppProfileError('NOT_FOUND')
  if (!QUALIFIABLE.has(row.status)) throw new AppProfileError('NOT_PENDING')
  if (row.candidateId == null) throw new AppProfileError('NOT_PENDING')
  await deps.setCandidateQualifie(row.candidateId)
  return { id, candidateId: row.candidateId, candidateStatus: 'QUALIFIE' as const }
}
