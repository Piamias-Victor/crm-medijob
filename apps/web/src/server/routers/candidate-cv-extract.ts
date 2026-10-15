import type { CvExtraction } from '@/server/ai/cv-extraction.schema'
import { matchJobTitles, type JobTitleOption } from '@/server/ai/job-title-match'
import { mapAssistantChatError } from '@/server/ai/router-errors'

type ExtractFile = {
  filename: string
  mimeType: string
  dataBase64: string
  jobTitles?: string[]
}

type ExtractDeps = {
  uploadCvBlob: (input: {
    pathname: string
    body: Buffer
    contentType: string
  }) => Promise<{ url: string }>
  deleteCvBlob: (url: string) => Promise<void>
  runCvExtraction: (file: ExtractFile) => Promise<CvExtraction>
  listJobTitles: () => Promise<JobTitleOption[]>
}

export async function uploadAndExtractCv(
  deps: ExtractDeps,
  input: { pathname: string; filename: string; mimeType: string; dataBase64: string },
) {
  const body = Buffer.from(input.dataBase64, 'base64')
  const blob = await deps.uploadCvBlob({
    pathname: input.pathname,
    body,
    contentType: input.mimeType,
  })

  try {
    const jobTitles = await deps.listJobTitles()
    const file = {
      filename: input.filename,
      mimeType: input.mimeType,
      dataBase64: input.dataBase64,
      jobTitles: jobTitles.map((title) => title.name),
    }
    let extraction: CvExtraction
    try {
      extraction = await deps.runCvExtraction(file)
    } catch {
      extraction = await deps.runCvExtraction(file)
    }
    const suggestedJobTitles = extraction.jobTitle
      ? matchJobTitles(extraction.jobTitle, jobTitles)
      : []
    return { cvUrl: blob.url, extraction, suggestedJobTitles }
  } catch (error) {
    await deps.deleteCvBlob(blob.url).catch(() => undefined)
    throw mapAssistantChatError(error)
  }
}
