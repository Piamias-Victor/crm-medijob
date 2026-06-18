'use client'

import { useState } from 'react'
import type { UseFormGetValues, UseFormSetValue } from 'react-hook-form'
import type { PharmacyInput, PharmacySiretLookup } from '@/view-models/pharmacy-form.schema'
import { computeNumeroTVA } from '@/lib/tva'

export function usePharmacySiretSearch(
  getValues: UseFormGetValues<PharmacyInput>,
  setValue: UseFormSetValue<PharmacyInput>,
  onSearchSiret: (query: string) => Promise<PharmacySiretLookup[]>,
) {
  const [searching, setSearching] = useState(false)

  const runSiret = async () => {
    const query = getValues('siret')?.trim() || getValues('name')?.trim()
    if (!query) return
    setSearching(true)
    try {
      const [match] = await onSearchSiret(query)
      if (!match) return
      setValue('name', match.name)
      setValue('siret', match.siret)
      setValue('address', match.address)
      setValue('city', match.city)
      setValue('postalCode', match.postalCode)
      const tva = computeNumeroTVA(match.siret)
      if (tva) setValue('numeroTVA', tva)
    } finally {
      setSearching(false)
    }
  }

  return { searching, runSiret }
}
