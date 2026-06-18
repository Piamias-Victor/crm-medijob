'use client'

import { useState } from 'react'
import type { UseFormGetValues, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { Input } from '@/components/atoms/Input'
import { FormField } from '@/components/molecules/FormField'
import { lookupCityByPostalCode, lookupPostalCodeByCity } from '@/lib/geo-fr'
import type { CandidateProfileInput } from '@/view-models/candidate-profile.schema'

type Props = {
  register: UseFormRegister<CandidateProfileInput>
  setValue: UseFormSetValue<CandidateProfileInput>
  getValues: UseFormGetValues<CandidateProfileInput>
}

export function CandidateGeoFields({ register, setValue, getValues }: Props) {
  const [geoHint, setGeoHint] = useState<string | null>(null)

  const fillCity = async () => {
    const postal = getValues('postalCode')?.trim()
    if (!postal || getValues('city')?.trim()) return
    setGeoHint(null)
    const city = await lookupCityByPostalCode(postal)
    if (city) {
      setValue('city', city)
      setGeoHint(`Ville complétée : ${city}`)
    }
  }

  const fillPostal = async () => {
    const city = getValues('city')?.trim()
    if (!city || getValues('postalCode')?.trim()) return
    setGeoHint(null)
    const postal = await lookupPostalCodeByCity(city)
    if (postal) {
      setValue('postalCode', postal)
      setGeoHint(`Code postal complété : ${postal}`)
    }
  }

  return (
    <>
      <FormField label="Ville" htmlFor="city">
        <Input id="city" {...register('city')} onBlur={fillPostal} />
      </FormField>
      <FormField label="Code postal" htmlFor="postalCode">
        <Input id="postalCode" {...register('postalCode')} onBlur={fillCity} />
      </FormField>
      {geoHint ? <p className="text-xs text-accent sm:col-span-2">{geoHint}</p> : null}
    </>
  )
}
