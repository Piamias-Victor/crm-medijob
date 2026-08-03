import type { PharmacyInput } from '@/view-models/pharmacy-form.schema'

export function buildPharmacyCreateDefaults(referentId?: string | null): PharmacyInput {
  return {
    name: '',
    status: 'PROSPECT',
    referentId: referentId ?? null,
  }
}
