'use client'

import type { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form'
import { contractOptions } from '@/lib/contract-options'
import type { MissionQuickCreateInput } from '@/view-models/mission-quick-create.schema'
import { Input } from '@/components/atoms/Input'
import { Combobox } from '@/components/molecules/Combobox'
import { DatePicker } from '@/components/molecules/DatePicker'
import { FormField } from '@/components/molecules/FormField'
import { CLEAR_DATE_LABEL, formatIsoDate, SELECT_DATE_LABEL } from '@/lib/date-picker-utils'

type Ref = { id: string; name: string }

type Props = {
  register: UseFormRegister<MissionQuickCreateInput>
  setValue: UseFormSetValue<MissionQuickCreateInput>
  watch: UseFormWatch<MissionQuickCreateInput>
  errors: FieldErrors<MissionQuickCreateInput>
  jobTitles: Ref[]
  recruiters: Ref[]
  onCreateJobTitle: (name: string) => Promise<{ value: string; label: string }>
}

export function MissionQuickCreateFields({
  register,
  setValue,
  watch,
  errors,
  jobTitles,
  recruiters,
  onCreateJobTitle,
}: Props) {
  const startDate = watch('startDate')

  return (
    <>
      <input type="hidden" {...register('pharmacyId')} />
      <FormField label="Titre" htmlFor="mission-title" error={errors.title?.message}>
        <Input id="mission-title" {...register('title')} placeholder="Ex. Adjoint CDD" />
      </FormField>
      <FormField label="Métier" error={errors.jobTitleId?.message}>
        <Combobox
          value={watch('jobTitleId')}
          onChange={(value) => setValue('jobTitleId', value, { shouldValidate: true })}
          options={jobTitles.map((j) => ({ value: j.id, label: j.name }))}
          onCreate={onCreateJobTitle}
        />
      </FormField>
      <FormField label="Contrat" error={errors.contractType?.message}>
        <Combobox
          value={watch('contractType')}
          onChange={(value) =>
            setValue('contractType', value as MissionQuickCreateInput['contractType'], { shouldValidate: true })
          }
          options={contractOptions}
        />
      </FormField>
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
      <FormField label="Référent" error={errors.referentId?.message}>
        <Combobox
          value={watch('referentId')}
          onChange={(value) => setValue('referentId', value, { shouldValidate: true })}
          options={recruiters.map((r) => ({ value: r.id, label: r.name }))}
        />
      </FormField>
    </>
  )
}
