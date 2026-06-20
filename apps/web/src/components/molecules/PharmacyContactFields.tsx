'use client'

import type { FieldErrors, UseFormGetValues, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { Input } from '@/components/atoms/Input'
import { FormField } from '@/components/molecules/FormField'
import { GeoFields } from '@/components/molecules/GeoFields'
import type { PharmacyInput } from '@/view-models/pharmacy-form.schema'

type Props = {
  register: UseFormRegister<PharmacyInput>
  setValue: UseFormSetValue<PharmacyInput>
  getValues: UseFormGetValues<PharmacyInput>
  errors: FieldErrors<PharmacyInput>
}

export function PharmacyContactFields({ register, setValue, getValues, errors }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <FormField label="Adresse" htmlFor="address">
          <Input id="address" className="h-11 rounded-lg bg-white/80" {...register('address')} />
        </FormField>
      </div>
      <GeoFields register={register} setValue={setValue} getValues={getValues} cityName="city" postalCodeName="postalCode" />
      <FormField label="Téléphone" htmlFor="phone">
        <Input id="phone" className="h-11 rounded-lg bg-white/80" {...register('phone')} />
      </FormField>
      <FormField label="Email" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" className="h-11 rounded-lg bg-white/80" {...register('email')} />
      </FormField>
      <div className="sm:col-span-2">
        <FormField label="Site web" htmlFor="website">
          <Input id="website" className="h-11 rounded-lg bg-white/80" {...register('website')} />
        </FormField>
      </div>
    </div>
  )
}
