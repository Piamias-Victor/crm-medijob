import { randomUUID } from 'node:crypto'
import type { CvExtraction } from '@/server/ai/cv-extraction.schema'
import type { JobTitleOption } from '@/server/ai/job-title-match'
import type { CandidateProfileUpdate } from '@/server/db/repositories/candidate-profile.repo'
import type { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { toCandidateUpdateData } from '@/view-models/candidate-profile-map'
import type {
  ExtractCvDraftInput,
  ExtractCvInput,
  ConfirmCvExtractionInput,
} from '@/server/routers/candidate-cv.schema'
import { uploadAndExtractCv } from '@/server/routers/candidate-cv-extract'
import { TRPCError } from '@trpc/server'

type BlobInput = { pathname: string; body: Buffer; contentType: string }

type ProfileRecord = NonNullable<Awaited<ReturnType<typeof candidateRepository.findProfileById>>>

export type CandidateCvDeps = {
  findProfileById: (id: string) => Promise<ProfileRecord | null>
  uploadCvBlob: (input: BlobInput) => Promise<{ url: string }>
  deleteCvBlob: (url: string) => Promise<void>
  runCvExtraction: (file: {
    filename: string
    mimeType: string
    dataBase64: string
    jobTitles?: string[]
  }) => Promise<CvExtraction>
  listJobTitles: () => Promise<JobTitleOption[]>
  confirmCvExtraction: (id: string, data: CandidateProfileUpdate & { cvUrl: string }) => Promise<unknown>
}

export async function handleExtractCvDraft(
  deps: Pick<CandidateCvDeps, 'uploadCvBlob' | 'deleteCvBlob' | 'runCvExtraction' | 'listJobTitles'>,
  input: ExtractCvDraftInput,
) {
  return uploadAndExtractCv(deps, {
    pathname: `candidate/import/${randomUUID()}/cv/${Date.now()}-${input.filename}`,
    filename: input.filename,
    mimeType: input.mimeType,
    dataBase64: input.dataBase64,
  })
}

export async function handleExtractCv(deps: CandidateCvDeps, input: ExtractCvInput) {
  const candidate = await deps.findProfileById(input.candidateId)
  if (!candidate) throw new TRPCError({ code: 'NOT_FOUND', message: 'Candidat introuvable.' })

  return uploadAndExtractCv(deps, {
    pathname: `candidate/${input.candidateId}/cv/${Date.now()}-${input.filename}`,
    filename: input.filename,
    mimeType: input.mimeType,
    dataBase64: input.dataBase64,
  })
}

export async function handleConfirmCvExtraction(
  deps: CandidateCvDeps,
  input: ConfirmCvExtractionInput,
) {
  const candidate = await deps.findProfileById(input.candidateId)
  if (!candidate) throw new TRPCError({ code: 'NOT_FOUND', message: 'Candidat introuvable.' })

  await deps.confirmCvExtraction(input.candidateId, {
    ...toCandidateUpdateData(input.data),
    cvUrl: input.cvUrl,
  })
  return { id: input.candidateId }
}
