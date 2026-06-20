type AnonymizedRecord = { anonymizedProfile: string | null }

export type AnonymizedPdfDownloadDeps = {
  findAnonymizedProfile: (candidateId: string) => Promise<AnonymizedRecord | null>
}

export async function loadAnonymizedProfilePdf(
  candidateId: string,
  deps: AnonymizedPdfDownloadDeps,
) {
  const candidate = await deps.findAnonymizedProfile(candidateId)
  if (!candidate?.anonymizedProfile?.trim()) return { status: 404 as const }
  return { status: 200 as const, content: candidate.anonymizedProfile }
}
