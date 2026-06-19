'use client'

import type { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form'
import { CONTRACT_TYPE_LABELS } from '@/lib/candidate-options'
import { CONTRACT_TYPES } from '@/view-models/candidate-profile.schema'
import type { MissionInput } from '@/view-models/mission-form.schema'
import { Input } from '@/components/atoms/Input'
import { Combobox } from '@/components/molecules/Combobox'
import { DatePicker } from '@/components/molecules/DatePicker'
import { FormField } from '@/components/molecules/FormField'
import { MissionFormAssignmentFields } from '@/components/molecules/MissionFormAssignmentFields'
import { MissionFormExtraFields } from '@/components/molecules/MissionFormExtraFields'
import { CLEAR_DATE_LABEL, formatIsoDate, SELECT_DATE_LABEL } from '@/lib/date-picker-utils'

type Ref = { id: string; name: string }
type ContactRef = { id: string; label: string }
const contractOptions = CONTRACT_TYPES.map((value) => ({
  value,
  label: CONTRACT_TYPE_LABELS[value],
}))

type Props = {
  register: UseFormRegister<MissionInput>
  setValue: UseFormSetValue<MissionInput>
  watch: UseFormWatch<MissionInput>
  errors: FieldErrors<MissionInput>
  jobTitles: Ref[]
  pharmacies: Ref[]
  recruiters: Ref[]
  contacts: ContactRef[]
  onCreateJobTitle: (name: string) => Promise<{ value: string; label: string }>
  onPharmacyChange: (pharmacyId: string) => void
}

export function MissionFormFields(props: Props) {
  const { register, setValue, watch, errors } = props
  const startDate = watch('startDate')
  const endDate = watch('endDate')

  return (
    <>
      <FormField label="Titre" htmlFor="mission-title" error={errors.title?.message}>
        <Input id="mission-title" {...register('title')} />
      </FormField>
      <FormField label="Métier" error={errors.jobTitleId?.message}>
        <Combobox
          value={watch('jobTitleId')}
          onChange={(value) => setValue('jobTitleId', value, { shouldValidate: true })}
          options={props.jobTitles.map((j) => ({ value: j.id, label: j.name }))}
          onCreate={props.onCreateJobTitle}
        />
      </FormField>
      <FormField label="Contrat" error={errors.contractType?.message}>
        <Combobox
          value={watch('contractType')}
          onChange={(value) =>
            setValue('contractType', value as MissionInput['contractType'], { shouldValidate: true })
          }
          options={contractOptions}
        />
      </FormField>
      <MissionFormAssignmentFields
        setValue={setValue}
        watch={watch}
        errors={errors}
        pharmacies={props.pharmacies}
        recruiters={props.recruiters}
        contacts={props.contacts}
        onPharmacyChange={props.onPharmacyChange}
      />
      <FormField label="Date de début" error={errors.startDate?.message}>
        <DatePicker
          value={startDate ? formatIsoDate(startDate) : undefined}
          emptyLabel={SELECT_DATE_LABEL}
          clearLabel={CLEAR_DATE_LABEL}
          onChange={(value) =>
            setValue('startDate', value ? new Date(value) : undefined, { shouldValidate: true })
          }
        />
      </FormField>
      <FormField label="Date de fin" error={errors.endDate?.message}>
        <DatePicker
          value={endDate ? formatIsoDate(endDate) : undefined}
          emptyLabel={SELECT_DATE_LABEL}
          clearLabel={CLEAR_DATE_LABEL}
          onChange={(value) =>
            setValue('endDate', value ? new Date(value) : undefined, { shouldValidate: true })
          }
        />
      </FormField>
      <MissionFormExtraFields register={register} setValue={setValue} watch={watch} errors={errors} />
    </>
  )
}
