export class AppProfileError extends Error {
  constructor(readonly code: 'NOT_FOUND' | 'NOT_PENDING') {
    super(code)
    this.name = 'AppProfileError'
  }
}

export type AcceptDeps = {
  findById: (
    id: string,
  ) => Promise<{ id: string; status: string; badakanId: string } | null>
  createCandidate: (data: unknown) => Promise<{ id: string }>
  markStatus: (id: string, status: 'ACCEPTE' | 'IGNORE', candidateId?: string | null) => Promise<unknown>
  importCvUrl?: (badakanId: string) => Promise<string | null>
}

export async function ignoreAppProfile(id: string, deps: Pick<AcceptDeps, 'findById' | 'markStatus'>) {
  const row = await deps.findById(id)
  if (!row) throw new AppProfileError('NOT_FOUND')
  if (row.status !== 'EN_ATTENTE') throw new AppProfileError('NOT_PENDING')
  await deps.markStatus(id, 'IGNORE')
  return { id, status: 'IGNORE' as const }
}

export async function acceptAppProfile(
  id: string,
  input: { data?: Record<string, unknown>; mergeCandidateId?: string },
  deps: AcceptDeps,
) {
  const row = await deps.findById(id)
  if (!row) throw new AppProfileError('NOT_FOUND')
  if (row.status !== 'EN_ATTENTE') throw new AppProfileError('NOT_PENDING')

  if (input.mergeCandidateId) {
    await deps.markStatus(id, 'ACCEPTE', input.mergeCandidateId)
    return { id, status: 'ACCEPTE' as const, candidateId: input.mergeCandidateId }
  }

  if (!input.data) throw new Error('ACCEPT_DATA_REQUIRED')
  let cvUrl: string | null = null
  if (deps.importCvUrl) {
    try {
      cvUrl = await deps.importCvUrl(row.badakanId)
    } catch {
      cvUrl = null
    }
  }
  const payload = cvUrl ? { ...input.data, cvUrl } : input.data
  const created = await deps.createCandidate(payload)
  await deps.markStatus(id, 'ACCEPTE', created.id)
  return { id, status: 'ACCEPTE' as const, candidateId: created.id }
}
