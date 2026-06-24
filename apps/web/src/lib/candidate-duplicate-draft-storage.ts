import { z } from 'zod'
import { isAllowedBlobUrl } from '@/server/services/blob'
import {
  candidateCreateInputSchema,
  candidateProfileInputSchema,
} from '@/view-models/candidate-profile.schema'
import type { DuplicateMatch } from '@/server/candidate/detect-duplicate.types'

export const CANDIDATE_DUPLICATE_DRAFT_KEY = 'candidate-duplicate-draft'

const matchSchema = z.object({
  candidateId: z.string(),
  reason: z.enum(['email', 'name_phone']),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
})

const draftShared = {
  cvUrl: z.string().url().refine(isAllowedBlobUrl, 'URL blob non autorisée').optional(),
  returnPath: z.string().min(1),
  matches: z.array(matchSchema),
}

const createDraftSchema = z.object({
  mode: z.literal('create'),
  incoming: candidateCreateInputSchema,
  ...draftShared,
})

const cvDraftSchema = z.object({
  mode: z.literal('cv'),
  incoming: candidateCreateInputSchema,
  ...draftShared,
})

const editDraftSchema = z.object({
  mode: z.literal('edit'),
  incoming: candidateProfileInputSchema,
  absorbedId: z.string().min(1),
  ...draftShared,
})

export const candidateDuplicateDraftSchema = z.discriminatedUnion('mode', [
  createDraftSchema,
  cvDraftSchema,
  editDraftSchema,
])

export type CandidateDuplicateDraft = z.infer<typeof candidateDuplicateDraftSchema>

export function saveCandidateDuplicateDraft(draft: CandidateDuplicateDraft) {
  sessionStorage.setItem(CANDIDATE_DUPLICATE_DRAFT_KEY, JSON.stringify(draft))
}

export function readCandidateDuplicateDraft(): CandidateDuplicateDraft | null {
  const raw = sessionStorage.getItem(CANDIDATE_DUPLICATE_DRAFT_KEY)
  if (!raw) return null
  try {
    const parsed = candidateDuplicateDraftSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

export function clearCandidateDuplicateDraft() {
  sessionStorage.removeItem(CANDIDATE_DUPLICATE_DRAFT_KEY)
}

export type { DuplicateMatch }
