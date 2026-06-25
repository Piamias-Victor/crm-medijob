import type { PharmacyInput } from '@/view-models/pharmacy-form.schema'

export function buildPharmacyCreateDefaults(): PharmacyInput {
  return {
    name: '',
    status: 'PROSPECT',
  }
}
