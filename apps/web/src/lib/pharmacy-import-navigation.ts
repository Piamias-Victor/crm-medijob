import { savePharmacyDuplicateDraft } from '@/lib/pharmacy-duplicate-draft-storage'
import {
  savePharmacyImportQueue,
  shiftPharmacyImportQueue,
  type PharmacyImportQueueItem,
} from '@/lib/pharmacy-import-queue-storage'

export function pharmacyDuplicateReviewHref(existingId?: string, pick?: boolean): string {
  const params = new URLSearchParams()
  if (existingId) params.set('existingId', existingId)
  if (pick) params.set('pick', '1')
  const query = params.toString()
  return query ? `/pharmacies/duplicate-review?${query}` : '/pharmacies/duplicate-review'
}

export function startPharmacyImportDuplicateReviews(items: PharmacyImportQueueItem[]): string | null {
  if (items.length === 0) return null
  const [first, ...rest] = items
  savePharmacyImportQueue(rest)
  return openPharmacyImportDuplicateItem(first)
}

export function openNextPharmacyImportDuplicate(): string | null {
  const next = shiftPharmacyImportQueue()
  if (!next) return null
  return openPharmacyImportDuplicateItem(next)
}

function openPharmacyImportDuplicateItem(item: PharmacyImportQueueItem): string {
  savePharmacyDuplicateDraft({
    mode: 'import',
    incoming: item.row,
    returnPath: '/pharmacies',
    matches: item.matches,
  })
  if (item.matches.length > 1) return pharmacyDuplicateReviewHref(undefined, true)
  return pharmacyDuplicateReviewHref(item.matches[0]?.pharmacyId)
}
