import type { UseFormSetValue } from 'react-hook-form'
import { computeNumeroTVA } from '@/lib/tva'
import type { PharmacyInput, PharmacySiretLookup } from '@/view-models/pharmacy-form.schema'

const dirty = { shouldDirty: true } as const

export function applyPharmacySiretLookup(
  setValue: UseFormSetValue<PharmacyInput>,
  match: PharmacySiretLookup,
) {
  setValue('name', match.name, dirty)
  setValue('siret', match.siret, dirty)
  setValue('address', match.address, dirty)
  setValue('city', match.city, dirty)
  setValue('postalCode', match.postalCode, dirty)
  const tva = computeNumeroTVA(match.siret)
  if (tva) setValue('numeroTVA', tva, dirty)
}
