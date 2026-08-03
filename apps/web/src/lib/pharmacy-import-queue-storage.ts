import { z } from 'zod'
import { pharmacyInputSchema } from '@/view-models/pharmacy-form.schema'

export const PHARMACY_IMPORT_QUEUE_KEY = 'pharmacy-import-queue'

const matchSchema = z.object({
  pharmacyId: z.string(),
  reason: z.enum(['siret', 'name_city_postal']),
  name: z.string(),
  siret: z.string().nullable(),
  city: z.string().nullable(),
  postalCode: z.string().nullable(),
  deletedAt: z.union([z.string(), z.date(), z.null()]),
})

const itemSchema = z.object({
  row: pharmacyInputSchema,
  matches: z.array(matchSchema),
})

const queueSchema = z.object({
  pending: z.array(itemSchema),
})

export type PharmacyImportQueueItem = z.infer<typeof itemSchema>

export function savePharmacyImportQueue(pending: PharmacyImportQueueItem[]) {
  sessionStorage.setItem(PHARMACY_IMPORT_QUEUE_KEY, JSON.stringify({ pending }))
}

export function readPharmacyImportQueue(): PharmacyImportQueueItem[] {
  const raw = sessionStorage.getItem(PHARMACY_IMPORT_QUEUE_KEY)
  if (!raw) return []
  try {
    const parsed = queueSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data.pending : []
  } catch {
    return []
  }
}

export function clearPharmacyImportQueue() {
  sessionStorage.removeItem(PHARMACY_IMPORT_QUEUE_KEY)
}

export function shiftPharmacyImportQueue(): PharmacyImportQueueItem | null {
  const pending = readPharmacyImportQueue()
  const [next, ...rest] = pending
  if (!next) {
    clearPharmacyImportQueue()
    return null
  }
  savePharmacyImportQueue(rest)
  return next
}
