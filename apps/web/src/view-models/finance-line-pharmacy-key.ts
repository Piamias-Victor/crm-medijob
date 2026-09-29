import { PHARMACY_UNLINKED_KEY } from '@/view-models/finance-line-unlinked'

/** Stable bucket key: linked id, else one key per Excel label (not a single unlinked dump). */
export function financeLinePharmacyKey(
  pharmacyId: string | null | undefined,
  pharmacyName: string,
) {
  if (pharmacyId) return pharmacyId
  const label = pharmacyName.trim().toLowerCase()
  return label ? `${PHARMACY_UNLINKED_KEY}:${label}` : PHARMACY_UNLINKED_KEY
}
