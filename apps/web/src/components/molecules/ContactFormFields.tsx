'use client'

import { Controller, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form'
import { CONTACT_ROLES, type ContactInput } from '@/view-models/contact-form.schema'
import { ROLE_LABELS } from '@/lib/contact-options'
import { FormField } from '@/components/molecules/FormField'
import { Combobox, type ComboboxOption } from '@/components/molecules/Combobox'
import { PrimaryToggle } from '@/components/molecules/PrimaryToggle'
import { contactInputClass } from '@/lib/contact-form-styles'

const ROLE_OPTIONS: ComboboxOption[] = CONTACT_ROLES.map((r) => ({
  value: r,
  label: ROLE_LABELS[r],
}))

type Props = {
  register: UseFormRegister<ContactInput>
  control: Control<ContactInput>
  errors: FieldErrors<ContactInput>
  pharmacyOptions: ComboboxOption[]
}

export function ContactFormFields({ register, control, errors, pharmacyOptions }: Props) {
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Pharmacie" error={errors.pharmacyId?.message}>
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
        </FormField>
        <FormField label="Fonction">
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Combobox value={field.value} onChange={field.onChange} options={ROLE_OPTIONS} />
            )}
          />
        </FormField>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Prénom" htmlFor="firstName" error={errors.firstName?.message}>
          <input id="firstName" className={contactInputClass} {...register('firstName')} />
        </FormField>
        <FormField label="Nom" htmlFor="lastName" error={errors.lastName?.message}>
          <input id="lastName" className={contactInputClass} {...register('lastName')} />
        </FormField>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Téléphone" htmlFor="phone">
          <input id="phone" type="tel" className={contactInputClass} {...register('phone')} />
        </FormField>
        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <input id="email" type="email" className={contactInputClass} {...register('email')} />
        </FormField>
      </div>
      <Controller
        name="isPrimary"
        control={control}
        render={({ field }) => (
          <PrimaryToggle checked={Boolean(field.value)} onChange={field.onChange} />
        )}
      />
      <FormField label="Notes" htmlFor="notes">
        <textarea id="notes" rows={3} className={contactInputClass} {...register('notes')} />
      </FormField>
    </>
  )
}
