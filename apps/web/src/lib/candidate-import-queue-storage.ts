import { z } from 'zod'
import { candidateCreateInputSchema } from '@/view-models/candidate-profile.schema'

export const CANDIDATE_IMPORT_QUEUE_KEY = 'candidate-import-queue'

const matchSchema = z.object({
  candidateId: z.string(),
  reason: z.enum(['email', 'phone']),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
})

const itemSchema = z.object({
  row: candidateCreateInputSchema,
  matches: z.array(matchSchema),
})

const queueSchema = z.object({
  pending: z.array(itemSchema),
})

export type CandidateImportQueueItem = z.infer<typeof itemSchema>

export function saveCandidateImportQueue(pending: CandidateImportQueueItem[]) {
  sessionStorage.setItem(CANDIDATE_IMPORT_QUEUE_KEY, JSON.stringify({ pending }))
}

export function readCandidateImportQueue(): CandidateImportQueueItem[] {
  const raw = sessionStorage.getItem(CANDIDATE_IMPORT_QUEUE_KEY)
  if (!raw) return []
  try {
    const parsed = queueSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data.pending : []
  } catch {
    return []
  }
}

export function clearCandidateImportQueue() {
  sessionStorage.removeItem(CANDIDATE_IMPORT_QUEUE_KEY)
}

export function shiftCandidateImportQueue(): CandidateImportQueueItem | null {
  const pending = readCandidateImportQueue()
  const [next, ...rest] = pending
  if (!next) {
    clearCandidateImportQueue()
    return null
  }
  saveCandidateImportQueue(rest)
  return next
}
