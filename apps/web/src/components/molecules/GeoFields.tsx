'use client'

import { useState } from 'react'
import type { FieldValues, Path, UseFormGetValues, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { Input } from '@/components/atoms/Input'
import { FormField } from '@/components/molecules/FormField'
import { lookupCityByPostalCode, lookupPostalCodeByCity } from '@/lib/geo-fr'

type Props<T extends FieldValues> = {
  register: UseFormRegister<T>
  setValue: UseFormSetValue<T>
  getValues: UseFormGetValues<T>
  cityName: Path<T>
  postalCodeName: Path<T>
}

export function GeoFields<T extends FieldValues>({ register, setValue, getValues, cityName, postalCodeName }: Props<T>) {
  const [geoHint, setGeoHint] = useState<string | null>(null)

  const fillCity = async () => {
    const postal = String(getValues(postalCodeName) ?? '').trim()
    if (!/^\d{5}$/.test(postal)) return
    if (String(getValues(cityName) ?? '').trim()) return
    setGeoHint(null)
    const city = await lookupCityByPostalCode(postal)
    if (city) {
      setValue(cityName, city as never)
      setGeoHint(`Ville complétée : ${city}`)
    }
  }

  const fillPostal = async () => {
    const city = String(getValues(cityName) ?? '').trim()
    if (!city) return
    const currentPostal = String(getValues(postalCodeName) ?? '').trim()
    if (currentPostal && /^\d{5}$/.test(currentPostal)) return
    setGeoHint(null)
    const postal = await lookupPostalCodeByCity(city)
    if (postal) {
      setValue(postalCodeName, postal as never)
      setGeoHint(`Code postal complété : ${postal}`)
    }
  }

  return (
    <>
      <FormField label="Ville" htmlFor={String(cityName)}>
        <Input id={String(cityName)} className="h-11 rounded-lg bg-white/80" {...register(cityName)} onBlur={fillPostal} />
      </FormField>
      <FormField label="Code postal" htmlFor={String(postalCodeName)}>
        <Input
          id={String(postalCodeName)}
          className="h-11 rounded-lg bg-white/80"
          {...register(postalCodeName)}
          onBlur={fillCity}
        />
      </FormField>
      {geoHint ? <p className="text-xs text-accent sm:col-span-2">{geoHint}</p> : null}
    </>
  )
}
