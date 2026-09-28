import type { CandidateStatus } from '@prisma/client'

export class AppProfileError extends Error {
  constructor(readonly code: 'NOT_FOUND' | 'NOT_PENDING') {
    super(code)
    this.name = 'AppProfileError'
  }
}

const IGNORABLE = new Set(['EN_ATTENTE', 'APP_VALIDATED'])

export type IgnoreDeps = {
  findById: (id: string) => Promise<{
    id: string
    status: string
    candidateId: string | null
    candidate?: { status: CandidateStatus } | null
  } | null>
  markStatus: (id: string, status: 'IGNORE') => Promise<unknown>
  setCandidateInactive: (candidateId: string, previous: CandidateStatus) => Promise<unknown>
}

export async function ignoreAppProfile(id: string, deps: IgnoreDeps) {
  const row = await deps.findById(id)
  if (!row) throw new AppProfileError('NOT_FOUND')
  if (!IGNORABLE.has(row.status)) throw new AppProfileError('NOT_PENDING')
  await deps.markStatus(id, 'IGNORE')
  if (row.candidateId != null && row.candidate != null) {
    await deps.setCandidateInactive(row.candidateId, row.candidate.status)
  }
  return { id, status: 'IGNORE' as const }
}
