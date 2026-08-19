export class ApplicationAcceptError extends Error {
  constructor(readonly code: 'NOT_FOUND' | 'NOT_PENDING') {
    super(code)
    this.name = 'ApplicationAcceptError'
  }
}

export type AcceptDeps = {
  findById: (id: string) => Promise<{ id: string; status: string; cvUrl: string | null } | null>
  createCandidate: (data: unknown) => Promise<{ id: string }>
  markAccepted: (id: string, candidateId: string) => Promise<unknown>
  copyCvUrl?: (sourceUrl: string) => Promise<string | null>
}

export async function acceptApplication(
  id: string,
  input: { data?: Record<string, unknown>; mergeCandidateId?: string },
  deps: AcceptDeps,
) {
  const row = await deps.findById(id)
  if (!row) throw new ApplicationAcceptError('NOT_FOUND')
  if (row.status !== 'EN_ATTENTE') throw new ApplicationAcceptError('NOT_PENDING')

  if (input.mergeCandidateId) {
    await deps.markAccepted(id, input.mergeCandidateId)
    return { id, status: 'ACCEPTEE' as const, candidateId: input.mergeCandidateId }
  }

  if (!input.data) throw new Error('ACCEPT_DATA_REQUIRED')
  let cvUrl: string | null = null
  if (deps.copyCvUrl && row.cvUrl) {
    try {
      cvUrl = await deps.copyCvUrl(row.cvUrl)
    } catch {
      cvUrl = null
    }
  }
  const payload = cvUrl ? { ...input.data, cvUrl } : input.data
  const created = await deps.createCandidate(payload)
  await deps.markAccepted(id, created.id)
  return { id, status: 'ACCEPTEE' as const, candidateId: created.id }
}
