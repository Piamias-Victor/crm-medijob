export type CandidateMergeErrorCode = 'NOT_FOUND' | 'SAME_ID'

export class CandidateMergeError extends Error {
  constructor(public code: CandidateMergeErrorCode) {
    super(code)
    this.name = 'CandidateMergeError'
  }
}

type MergeTx = {
  candidate: {
    findFirst: (args: {
      where: { id: string; deletedAt: null }
    }) => Promise<{ id: string } | null>
  }
}

export async function assertMergeCandidatesValid(
  tx: MergeTx,
  keptId: string,
  absorbedId?: string,
) {
  if (absorbedId && keptId === absorbedId) {
    throw new CandidateMergeError('SAME_ID')
  }

  const kept = await tx.candidate.findFirst({ where: { id: keptId, deletedAt: null } })
  if (!kept) throw new CandidateMergeError('NOT_FOUND')

  if (!absorbedId) return

  const absorbed = await tx.candidate.findFirst({ where: { id: absorbedId, deletedAt: null } })
  if (!absorbed) throw new CandidateMergeError('NOT_FOUND')
}
