import { type ReactNode } from 'react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { Input } from '@/components/atoms/Input'
import { FormField } from '@/components/molecules/FormField'
import type { PharmacyInput } from '@/view-models/pharmacy-form.schema'

type Props = {
  register: UseFormRegister<PharmacyInput>
  errors: FieldErrors<PharmacyInput>
  nameButton: ReactNode
  siretButton: ReactNode
}

function SearchField({
  label,
  htmlFor,
  placeholder,
  register,
  button,
}: {
  label: string
  htmlFor: string
  placeholder?: string
  register: UseFormRegister<PharmacyInput>
  button: ReactNode
}) {
  return (
    <FormField label={label} htmlFor={htmlFor}>
      <div className="flex gap-2">
        <Input
          id={htmlFor}
          placeholder={placeholder}
          className="h-11 flex-1 rounded-lg bg-white/80"
          {...register(htmlFor as 'name' | 'siret')}
        />
        {button}
      </div>
    </FormField>
  )
}

export function PharmacyLegalFields({ register, errors, nameButton, siretButton }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <FormField label="Nom" htmlFor="name" error={errors.name?.message}>
          <div className="flex gap-2">
            <Input id="name" className="h-11 flex-1 rounded-lg bg-white/80" {...register('name')} />
            {nameButton}
          </div>
        </FormField>
      </div>
      <div className="sm:col-span-2">
        <SearchField label="SIRET" htmlFor="siret" placeholder="14 chiffres" register={register} button={siretButton} />
      </div>
      <div className="sm:col-span-2">
        <FormField label="N° TVA" htmlFor="numeroTVA">
          <Input id="numeroTVA" readOnly className="h-11 rounded-lg bg-surface/60" {...register('numeroTVA')} />
        </FormField>
      </div>
    </div>
  )
}
