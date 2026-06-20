import { inferCvFilename, inferCvMimeType } from '@/lib/candidate-cv-url'

type CvRecord = { cvUrl: string | null }

type BlobStream = {
  stream: ReadableStream<Uint8Array>
  contentType: string
}

export type CandidateCvDownloadDeps = {
  findCvUrl: (candidateId: string) => Promise<CvRecord | null>
  fetchBlob: (url: string) => Promise<BlobStream | null>
}

export async function loadCandidateCvStream(candidateId: string, deps: CandidateCvDownloadDeps) {
  const candidate = await deps.findCvUrl(candidateId)
  if (!candidate?.cvUrl) return { status: 404 as const }

  const blob = await deps.fetchBlob(candidate.cvUrl)
  if (!blob) return { status: 404 as const }

  return {
    status: 200 as const,
    stream: blob.stream,
    contentType: blob.contentType || inferCvMimeType(candidate.cvUrl),
    filename: inferCvFilename(candidate.cvUrl),
  }
}
