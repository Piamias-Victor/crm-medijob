import { randomUUID } from 'node:crypto'
import type { CvExtraction } from '@/server/ai/cv-extraction.schema'
import { matchJobTitles, type JobTitleOption } from '@/server/ai/job-title-match'
import { mapAssistantChatError } from '@/server/ai/router-errors'
import type { CandidateProfileUpdate } from '@/server/db/repositories/candidate-profile.repo'
import type { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { toCandidateUpdateData } from '@/view-models/candidate-profile-map'
import type {
  ExtractCvDraftInput,
  ExtractCvInput,
  ConfirmCvExtractionInput,
} from '@/server/routers/candidate-cv.schema'
import { TRPCError } from '@trpc/server'

type BlobInput = { pathname: string; body: Buffer; contentType: string }

type ProfileRecord = NonNullable<Awaited<ReturnType<typeof candidateRepository.findProfileById>>>

export type CandidateCvDeps = {
  findProfileById: (id: string) => Promise<ProfileRecord | null>
  uploadCvBlob: (input: BlobInput) => Promise<{ url: string }>
  deleteCvBlob: (url: string) => Promise<void>
  runCvExtraction: (file: { filename: string; mimeType: string; dataBase64: string }) => Promise<CvExtraction>
  listJobTitles: () => Promise<JobTitleOption[]>
  confirmCvExtraction: (id: string, data: CandidateProfileUpdate & { cvUrl: string }) => Promise<unknown>
}

async function uploadAndExtractCv(
  deps: Pick<CandidateCvDeps, 'uploadCvBlob' | 'deleteCvBlob' | 'runCvExtraction' | 'listJobTitles'>,
  input: { pathname: string; filename: string; mimeType: string; dataBase64: string },
) {
  const body = Buffer.from(input.dataBase64, 'base64')
  const blob = await deps.uploadCvBlob({
    pathname: input.pathname,
    body,
    contentType: input.mimeType,
  })

  try {
    const extraction = await deps.runCvExtraction({
      filename: input.filename,
      mimeType: input.mimeType,
      dataBase64: input.dataBase64,
    })
    const suggestedJobTitles = extraction.jobTitle
      ? matchJobTitles(extraction.jobTitle, await deps.listJobTitles())
      : []
    return { cvUrl: blob.url, extraction, suggestedJobTitles }
  } catch (error) {
    await deps.deleteCvBlob(blob.url).catch(() => undefined)
    throw mapAssistantChatError(error)
  }
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
