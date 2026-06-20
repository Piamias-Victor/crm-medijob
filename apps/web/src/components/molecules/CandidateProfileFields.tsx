'use client'

import type { FieldErrors, UseFormGetValues, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { Input } from '@/components/atoms/Input'
import { Textarea } from '@/components/atoms/Textarea'
import { FormField } from '@/components/molecules/FormField'
import { ASAP_DATE_LABEL } from '@/lib/date-picker-utils'
import { DatePicker } from '@/components/molecules/DatePicker'
import { CandidateGeoFields } from '@/components/molecules/CandidateGeoFields'
import type { CandidateProfileInput } from '@/view-models/candidate-profile.schema'

type Props = {
  register: UseFormRegister<CandidateProfileInput>
  errors: FieldErrors<CandidateProfileInput>
  setValue: UseFormSetValue<CandidateProfileInput>
  getValues: UseFormGetValues<CandidateProfileInput>
  availableFrom?: string
  onAvailableFrom: (value: string | undefined) => void
}

export function CandidateProfileFields({
  register,
  errors,
  setValue,
  getValues,
  availableFrom,
  onAvailableFrom,
}: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField label="Prénom" htmlFor="firstName" error={errors.firstName?.message}>
        <Input id="firstName" {...register('firstName')} />
      </FormField>
      <FormField label="Nom" htmlFor="lastName" error={errors.lastName?.message}>
        <Input id="lastName" {...register('lastName')} />
      </FormField>
      <FormField label="Email" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" {...register('email')} />
      </FormField>
      <FormField label="Téléphone" htmlFor="phone">
        <Input id="phone" {...register('phone')} />
      </FormField>
      <div className="sm:col-span-2">
        <FormField label="Adresse" htmlFor="address">
          <Input id="address" {...register('address')} />
        </FormField>
      </div>
      <CandidateGeoFields register={register} setValue={setValue} getValues={getValues} />
      <FormField label="Rayon mobilité (km)" htmlFor="mobilityRadiusKm">
        <Input
          id="mobilityRadiusKm"
          type="number"
          min={1}
          max={500}
          {...register('mobilityRadiusKm', { valueAsNumber: true })}
        />
      </FormField>
      <FormField label="Disponible à partir du" htmlFor="availableFrom">
        <DatePicker
          id="availableFrom"
          value={availableFrom}
          onChange={onAvailableFrom}
          emptyLabel={ASAP_DATE_LABEL}
          clearLabel={ASAP_DATE_LABEL}
        />
      </FormField>
      <div className="sm:col-span-2">
        <FormField label="Notes mobilité" htmlFor="mobilityNotes">
          <Input id="mobilityNotes" {...register('mobilityNotes')} />
        </FormField>
      </div>
      <div className="sm:col-span-2">
        <FormField label="Résumé IA (notes internes)" htmlFor="notes">
          <Textarea id="notes" rows={4} {...register('notes')} />
        </FormField>
      </div>
    </div>
  )
}
