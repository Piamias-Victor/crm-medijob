import type { DuplicateProbe } from '@/lib/candidate-duplicate-probe.types'

export function toCvExtractionDuplicateProbe(extraction: {
  firstName: string
  lastName: string
  email?: string | null
  phone?: string | null
}): DuplicateProbe {
  return {
    firstName: extraction.firstName ?? '',
    lastName: extraction.lastName ?? '',
    email: extraction.email ?? '',
    phone: extraction.phone ?? '',
  }
}
