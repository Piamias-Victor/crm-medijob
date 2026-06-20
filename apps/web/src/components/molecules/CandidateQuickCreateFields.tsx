'use client'

import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { Input } from '@/components/atoms/Input'
import { Combobox } from '@/components/molecules/Combobox'
import { FormField } from '@/components/molecules/FormField'
import type { CandidateQuickCreateInput } from '@/view-models/candidate-quick-create.schema'

type Ref = { id: string; name: string }

type Props = {
  register: UseFormRegister<CandidateQuickCreateInput>
  setValue: UseFormSetValue<CandidateQuickCreateInput>
  watch: UseFormWatch<CandidateQuickCreateInput>
  errors: FieldErrors<CandidateQuickCreateInput>
  jobTitles: Ref[]
  recruiters: Ref[]
}

export function CandidateQuickCreateFields({
  register,
  setValue,
  watch,
  errors,
  jobTitles,
  recruiters,
}: Props) {
  return (
    <>
      <FormField label="Prénom" htmlFor="candidate-firstName" error={errors.firstName?.message}>
        <Input id="candidate-firstName" {...register('firstName')} />
      </FormField>
      <FormField label="Nom" htmlFor="candidate-lastName" error={errors.lastName?.message}>
        <Input id="candidate-lastName" {...register('lastName')} />
      </FormField>
      <FormField label="Email" htmlFor="candidate-email" error={errors.email?.message}>
        <Input id="candidate-email" type="email" {...register('email')} />
      </FormField>
      <FormField label="Téléphone" htmlFor="candidate-phone" error={errors.phone?.message}>
        <Input id="candidate-phone" {...register('phone')} />
      </FormField>
      <FormField label="Ville" htmlFor="candidate-city" error={errors.city?.message}>
        <Input id="candidate-city" {...register('city')} />
      </FormField>
      <FormField label="Métier" error={errors.jobTitleId?.message}>
        <Combobox
          value={watch('jobTitleId')}
          onChange={(value) => setValue('jobTitleId', value, { shouldValidate: true })}
          options={jobTitles.map((j) => ({ value: j.id, label: j.name }))}
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
