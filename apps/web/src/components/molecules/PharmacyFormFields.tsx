import { type ReactNode } from 'react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { Input } from '@/components/atoms/Input'
import { FormField } from '@/components/molecules/FormField'
import { type PharmacyInput } from '@/view-models/pharmacy-form.schema'

type Props = {
  register: UseFormRegister<PharmacyInput>
  errors: FieldErrors<PharmacyInput>
  siretButton: ReactNode
  selects: ReactNode
}

export function PharmacyFormFields({ register, errors, siretButton, selects }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormField label="Nom" htmlFor="name" error={errors.name?.message}>
        <Input id="name" {...register('name')} />
      </FormField>
      <FormField label="SIRET" htmlFor="siret">
        <div className="flex gap-2">
          <Input id="siret" placeholder="14 chiffres" {...register('siret')} />
          {siretButton}
        </div>
      </FormField>
      <FormField label="N° TVA" htmlFor="numeroTVA">
        <Input id="numeroTVA" readOnly {...register('numeroTVA')} />
      </FormField>
      <FormField label="Adresse" htmlFor="address">
        <Input id="address" {...register('address')} />
      </FormField>
      <FormField label="Ville" htmlFor="city">
        <Input id="city" {...register('city')} />
      </FormField>
      <FormField label="Code postal" htmlFor="postalCode">
        <Input id="postalCode" {...register('postalCode')} />
      </FormField>
      <FormField label="Téléphone" htmlFor="phone">
        <Input id="phone" {...register('phone')} />
      </FormField>
      <FormField label="Email" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" {...register('email')} />
      </FormField>
      <FormField label="Site web" htmlFor="website">
        <Input id="website" {...register('website')} />
      </FormField>
      {selects}
    </div>
  )
}
