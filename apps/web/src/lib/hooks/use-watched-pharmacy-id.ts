import { useWatch, type Control } from 'react-hook-form'
import type { ContactInput } from '@/view-models/contact-form.schema'

export function useWatchedPharmacyId(
  control: Control<ContactInput>,
  fallback?: string,
): string | undefined {
  const watched = useWatch({ control, name: 'pharmacyId', defaultValue: fallback })
  if (typeof watched === 'string' && watched.length > 0) return watched
  return fallback
}
