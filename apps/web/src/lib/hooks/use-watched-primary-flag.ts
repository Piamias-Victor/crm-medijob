import { useWatch, type Control } from 'react-hook-form'
import type { ContactInput } from '@/view-models/contact-form.schema'

export function useWatchedPrimaryFlag(
  control: Control<ContactInput>,
  fallback?: boolean,
): boolean {
  const watched = useWatch({ control, name: 'isPrimary', defaultValue: fallback ?? false })
  return Boolean(watched)
}
