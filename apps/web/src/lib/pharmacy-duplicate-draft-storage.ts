import { z } from 'zod'
import { pharmacyInputSchema } from '@/view-models/pharmacy-form.schema'

export const PHARMACY_DUPLICATE_DRAFT_KEY = 'pharmacy-duplicate-draft'

const matchSchema = z.object({
  pharmacyId: z.string(),
  reason: z.enum(['siret', 'name_city_postal']),
  name: z.string(),
  siret: z.string().nullable(),
  city: z.string().nullable(),
  postalCode: z.string().nullable(),
  deletedAt: z.union([z.string(), z.date(), z.null()]),
})

export const pharmacyDuplicateDraftSchema = z.object({
  mode: z.literal('import'),
  incoming: pharmacyInputSchema,
  returnPath: z.string().min(1),
  matches: z.array(matchSchema),
})

export type PharmacyDuplicateDraft = z.infer<typeof pharmacyDuplicateDraftSchema>

export function savePharmacyDuplicateDraft(draft: PharmacyDuplicateDraft) {
  sessionStorage.setItem(PHARMACY_DUPLICATE_DRAFT_KEY, JSON.stringify(draft))
}

export function readPharmacyDuplicateDraft(): PharmacyDuplicateDraft | null {
  const raw = sessionStorage.getItem(PHARMACY_DUPLICATE_DRAFT_KEY)
  if (!raw) return null
  try {
    const parsed = pharmacyDuplicateDraftSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

export function clearPharmacyDuplicateDraft() {
  sessionStorage.removeItem(PHARMACY_DUPLICATE_DRAFT_KEY)
}
