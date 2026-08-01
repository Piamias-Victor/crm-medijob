'use client'

import { Controller, type Control } from 'react-hook-form'
import type { ContactInput } from '@/view-models/contact-form.schema'
import { FormField } from '@/components/molecules/FormField'
import { Combobox, type ComboboxOption } from '@/components/molecules/Combobox'

type Props = {
  control: Control<ContactInput>
  pharmacyOptions: ComboboxOption[]
  roleOptions: ComboboxOption[]
  pharmacyError?: string
  lockedPharmacyId?: string
}

export function ContactAffiliationFields({
  control,
  pharmacyOptions,
  roleOptions,
  pharmacyError,
  lockedPharmacyId,
}: Props) {
  const lockedPharmacy = lockedPharmacyId
    ? pharmacyOptions.find((option) => option.value === lockedPharmacyId)
    : undefined

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormField label="Pharmacie" error={pharmacyError}>
        {lockedPharmacy ? (
          <p className="flex h-11 items-center rounded-lg border border-border/60 bg-surface/60 px-3 text-sm text-fg">
            {lockedPharmacy.label}
          </p>
        ) : (
          <Controller
            name="pharmacyId"
            control={control}
            render={({ field }) => (
              <Combobox
                value={field.value}
                onChange={field.onChange}
                options={pharmacyOptions}
                placeholder="Sélectionner une pharmacie"
              />
            )}
          />
        )}
      </FormField>
      <FormField label="Fonction">
        <Controller
          name="contactRoleId"
          control={control}
          render={({ field }) => (
            <Combobox value={field.value} onChange={field.onChange} options={roleOptions} />
          )}
        />
      </FormField>
    </div>
  )
}
