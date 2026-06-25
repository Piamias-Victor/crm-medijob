import { z } from 'zod'
import { cvExtractionSchema } from '@/server/ai/cv-extraction.schema'
import { isAllowedBlobUrl } from '@/server/services/blob'
import type { CvExtraction } from '@/server/ai/cv-extraction.schema'
import type { RefItem } from '@/view-models/referential'

export const CV_IMPORT_DRAFT_KEY = 'cv-import-draft'

const draftSchema = z.object({
  cvUrl: z.string().url().refine(isAllowedBlobUrl, 'URL blob non autorisée'),
  extraction: cvExtractionSchema,
  suggestedJobTitles: z.array(z.object({ id: z.string(), name: z.string() })),
  previewUrl: z.string().min(1),
  previewMimeType: z.string().min(1),
  previewFilename: z.string().min(1),
})

export type CvImportDraft = {
  cvUrl: string
  extraction: CvExtraction
  suggestedJobTitles: RefItem[]
  previewUrl: string
  previewMimeType: string
  previewFilename: string
}

export function saveCvImportDraft(draft: CvImportDraft) {
  sessionStorage.setItem(CV_IMPORT_DRAFT_KEY, JSON.stringify(draft))
}

export function readCvImportDraft(): CvImportDraft | null {
  const raw = sessionStorage.getItem(CV_IMPORT_DRAFT_KEY)
  if (!raw) return null
  try {
    const parsed = draftSchema.safeParse(JSON.parse(raw))
    if (!parsed.success) return null
    return parsed.data
  } catch {
    return null
  }
}

export function clearCvImportDraft() {
  sessionStorage.removeItem(CV_IMPORT_DRAFT_KEY)
}

export function revokeCvImportPreview(previewUrl: string) {
  if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
}
