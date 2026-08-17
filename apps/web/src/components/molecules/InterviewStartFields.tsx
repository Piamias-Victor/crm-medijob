'use client'

import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { Input } from '@/components/atoms/Input'
import { Combobox } from '@/components/molecules/Combobox'
import { FormField } from '@/components/molecules/FormField'
import { INTERVIEW_MODE_OPTIONS, parseInterviewMode } from '@/view-models/interview-labels'
import type { InterviewStartInput } from '@/view-models/interview-start.schema'

type JobTitle = { id: string; name: string }

type Props = {
  register: UseFormRegister<InterviewStartInput>
  setValue: UseFormSetValue<InterviewStartInput>
  watch: UseFormWatch<InterviewStartInput>
  errors: FieldErrors<InterviewStartInput>
  jobTitles: JobTitle[]
}

export function InterviewStartFields({ register, setValue, watch, errors, jobTitles }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField label="Prénom" htmlFor="interview-firstName" error={errors.firstName?.message}>
        <Input id="interview-firstName" {...register('firstName')} />
      </FormField>
      <FormField label="Nom" htmlFor="interview-lastName" error={errors.lastName?.message}>
        <Input id="interview-lastName" {...register('lastName')} />
      </FormField>
      <FormField label="Email" htmlFor="interview-email" error={errors.email?.message}>
        <Input id="interview-email" type="email" {...register('email')} />
      </FormField>
      <FormField label="Téléphone" htmlFor="interview-phone" error={errors.phone?.message}>
        <Input id="interview-phone" {...register('phone')} />
      </FormField>
      <FormField label="Métier" error={errors.jobTitleId?.message}>
        <Combobox
          value={watch('jobTitleId')}
          onChange={(value) => setValue('jobTitleId', value, { shouldValidate: true })}
          options={jobTitles.map((job) => ({ value: job.id, label: job.name }))}
          placeholder="Choisir un métier"
        />
      </FormField>
      <FormField label="Mode" error={errors.mode?.message}>
        <Combobox
          value={watch('mode')}
          onChange={(value) =>
            setValue('mode', parseInterviewMode(value), { shouldValidate: true })
          }
          options={INTERVIEW_MODE_OPTIONS}
          placeholder="Choisir un mode"
        />
      </FormField>
    </div>
  )
}
