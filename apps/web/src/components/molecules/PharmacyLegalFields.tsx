import { type ReactNode } from 'react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { Input } from '@/components/atoms/Input'
import { FormField } from '@/components/molecules/FormField'
import type { PharmacyInput } from '@/view-models/pharmacy-form.schema'

type Props = {
  register: UseFormRegister<PharmacyInput>
  errors: FieldErrors<PharmacyInput>
  siretButton: ReactNode
}

export function PharmacyLegalFields({ register, errors, siretButton }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <FormField label="Nom" htmlFor="name" error={errors.name?.message}>
          <Input id="name" className="h-11 rounded-lg bg-white/80" {...register('name')} />
        </FormField>
      </div>
      <div className="sm:col-span-2">
        <FormField label="SIRET" htmlFor="siret">
          <div className="flex gap-2">
            <Input
              id="siret"
              placeholder="14 chiffres"
              className="h-11 flex-1 rounded-lg bg-white/80"
              {...register('siret')}
            />
            {siretButton}
          </div>
        </FormField>
      </div>
      <div className="sm:col-span-2">
        <FormField label="N° TVA" htmlFor="numeroTVA">
          <Input id="numeroTVA" readOnly className="h-11 rounded-lg bg-surface/60" {...register('numeroTVA')} />
        </FormField>
      </div>
    </div>
  )
}
