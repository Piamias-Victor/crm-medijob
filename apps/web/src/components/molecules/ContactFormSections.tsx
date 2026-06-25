'use client'

import { Controller, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form'
import { Textarea } from '@/components/atoms/Textarea'
import { ContactAffiliationFields } from '@/components/molecules/ContactAffiliationFields'
import { ContactCoordFields } from '@/components/molecules/ContactCoordFields'
import { ContactIdentityFields } from '@/components/molecules/ContactIdentityFields'
import { ContactPrimaryWarningAlert } from '@/components/molecules/ContactPrimaryWarningAlert'
import { FormSection } from '@/components/molecules/FormSection'
import { PrimaryToggle } from '@/components/molecules/PrimaryToggle'
import type { ComboboxOption } from '@/components/molecules/Combobox'
import type { ContactInput } from '@/view-models/contact-form.schema'

type Props = {
  register: UseFormRegister<ContactInput>
  control: Control<ContactInput>
  errors: FieldErrors<ContactInput>
  pharmacyOptions: ComboboxOption[]
  pharmacyId?: string
  isPrimary: boolean
  excludeContactId?: string
  lockedPharmacyId?: string
}

export function ContactFormSections({
  register,
  control,
  errors,
  pharmacyOptions,
  pharmacyId,
  isPrimary,
  excludeContactId,
  lockedPharmacyId,
}: Props) {
  return (
    <>
      <FormSection title="Rattachement">
        <div className="flex flex-col gap-4">
          <ContactAffiliationFields
            control={control}
            pharmacyOptions={pharmacyOptions}
            pharmacyError={errors.pharmacyId?.message}
            lockedPharmacyId={lockedPharmacyId}
          />
          <ContactPrimaryWarningAlert
            pharmacyId={pharmacyId}
            isPrimary={isPrimary}
            excludeContactId={excludeContactId}
          />
        </div>
      </FormSection>
      <FormSection title="Identité">
        <ContactIdentityFields register={register} errors={errors} />
      </FormSection>
      <FormSection title="Coordonnées">
        <ContactCoordFields register={register} errors={errors} />
      </FormSection>
      <FormSection title="Statut">
        <Controller
          name="isPrimary"
          control={control}
          render={({ field }) => (
            <PrimaryToggle checked={Boolean(field.value)} onChange={field.onChange} />
          )}
        />
      </FormSection>
      <FormSection title="Notes">
        <Textarea id="notes" rows={3} aria-label="Notes" className="rounded-lg bg-white/80" {...register('notes')} />
      </FormSection>
    </>
  )
}
