import { TRPCError } from '@trpc/server'

export type EraseCandidateGdprInput = {
  candidateId: string
  erasedByUserId: string
  reason?: string
}

export type EraseCandidateGdprDeps = {
  findCandidateForErase: (id: string) => Promise<{ id: string; cvUrl: string | null } | null>
  listDocumentUrls: (candidateId: string) => Promise<string[]>
  listApplicationCvUrls: (candidateId: string) => Promise<string[]>
  deleteBlobs: (urls: string[]) => Promise<void>
  hardDeleteCandidateCascade: (id: string) => Promise<void>
  createAudit: (data: {
    entityType: 'CANDIDATE'
    entityId: string
    erasedByUserId: string
    reason?: string
  }) => Promise<void>
}

export async function eraseCandidateGdpr(
  deps: EraseCandidateGdprDeps,
  input: EraseCandidateGdprInput,
): Promise<{ id: string }> {
  const candidate = await deps.findCandidateForErase(input.candidateId)
  if (!candidate) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Candidat introuvable' })
  }

  const [docUrls, appUrls] = await Promise.all([
    deps.listDocumentUrls(candidate.id),
    deps.listApplicationCvUrls(candidate.id),
  ])
  const urls = [...new Set([candidate.cvUrl, ...docUrls, ...appUrls].filter((u): u is string => !!u))]
  await deps.deleteBlobs(urls)
  await deps.hardDeleteCandidateCascade(candidate.id)
  await deps.createAudit({
    entityType: 'CANDIDATE',
    entityId: candidate.id,
    erasedByUserId: input.erasedByUserId,
    reason: input.reason,
  })
  return { id: candidate.id }
}
