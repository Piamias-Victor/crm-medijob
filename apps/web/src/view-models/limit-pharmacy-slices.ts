import type { FacturationSliceBucket } from '@/view-models/facturation-slice-bucket'

export const FACTURATION_PHARMACY_CHART_LIMIT = 8
export const FACTURATION_PHARMACY_OTHERS_KEY = '__other__'
export const FACTURATION_PHARMACY_OTHERS_LABEL = 'Autres'

export function limitPharmacySlices(buckets: FacturationSliceBucket[]): FacturationSliceBucket[] {
  const sorted = [...buckets].sort((a, b) => b.ca - a.ca)
  if (sorted.length <= FACTURATION_PHARMACY_CHART_LIMIT) return sorted
  const head = sorted.slice(0, FACTURATION_PHARMACY_CHART_LIMIT)
  const tail = sorted.slice(FACTURATION_PHARMACY_CHART_LIMIT)
  return [
    ...head,
    {
      key: FACTURATION_PHARMACY_OTHERS_KEY,
      label: FACTURATION_PHARMACY_OTHERS_LABEL,
      ca: tail.reduce((sum, item) => sum + item.ca, 0),
      marge: tail.reduce((sum, item) => sum + item.marge, 0),
    },
  ]
}
