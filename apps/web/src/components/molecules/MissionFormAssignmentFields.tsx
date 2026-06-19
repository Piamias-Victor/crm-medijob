'use client'

import type { UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form'
import type { MissionInput } from '@/view-models/mission-form.schema'
import { Combobox } from '@/components/molecules/Combobox'
import { FormField } from '@/components/molecules/FormField'

type Ref = { id: string; name: string }
type ContactRef = { id: string; label: string }

type Props = {
  setValue: UseFormSetValue<MissionInput>
  watch: UseFormWatch<MissionInput>
  errors: FieldErrors<MissionInput>
  pharmacies: Ref[]
  recruiters: Ref[]
  contacts: ContactRef[]
  onPharmacyChange: (pharmacyId: string) => void
}

export function MissionFormAssignmentFields(props: Props) {
  const { setValue, watch, errors } = props

  return (
    <>
      <FormField label="Pharmacie" error={errors.pharmacyId?.message}>
        <Combobox
          value={watch('pharmacyId')}
          onChange={(value) => {
            setValue('pharmacyId', value, { shouldValidate: true })
            setValue('contactId', undefined, { shouldValidate: true })
            props.onPharmacyChange(value)
          }}
          options={props.pharmacies.map((p) => ({ value: p.id, label: p.name }))}
        />
      </FormField>
      <FormField label="Contact" error={errors.contactId?.message}>
        <Combobox
          value={watch('contactId') ?? ''}
          onChange={(value) => setValue('contactId', value || undefined, { shouldValidate: true })}
          options={props.contacts.map((c) => ({ value: c.id, label: c.label }))}
        />
      </FormField>
      <FormField label="Référent" error={errors.referentId?.message}>
        <Combobox
          value={watch('referentId')}
          onChange={(value) => setValue('referentId', value, { shouldValidate: true })}
          options={props.recruiters.map((r) => ({ value: r.id, label: r.name }))}
        />
      </FormField>
    </>
  )
}
