'use client'

import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { Input } from '@/components/atoms/Input'
import { FormField } from '@/components/molecules/FormField'
import { Combobox } from '@/components/molecules/Combobox'
import { MANUAL_CANDIDATE_STATUS_OPTIONS } from '@/lib/candidate-status-options'
import type { CandidateProfileInput } from '@/view-models/candidate-profile.schema'

type Props = {
  register: UseFormRegister<CandidateProfileInput>
  errors: FieldErrors<CandidateProfileInput>
  status: CandidateProfileInput['status']
  onStatus: (value: CandidateProfileInput['status']) => void
}

export function CandidateStatusSalaryFields({ register, errors, status, onStatus }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField label="Statut candidat" error={errors.status?.message}>
        <Combobox
          value={status}
          onChange={(value) => onStatus(value as CandidateProfileInput['status'])}
          options={MANUAL_CANDIDATE_STATUS_OPTIONS}
          placeholder="Choisir un statut"
        />
      </FormField>
      <FormField label="Prétentions salariales" htmlFor="salaryExpectations">
        <Input id="salaryExpectations" {...register('salaryExpectations')} />
      </FormField>
      <FormField label="Salaire min (€)" htmlFor="salaryMin" error={errors.salaryMin?.message}>
        <Input
          id="salaryMin"
          type="number"
          min={0}
          {...register('salaryMin', {
            setValueAs: (value) =>
              value === '' || value == null || Number.isNaN(Number(value)) ? null : Number(value),
          })}
        />
      </FormField>
      <FormField label="Salaire max (€)" htmlFor="salaryMax" error={errors.salaryMax?.message}>
        <Input
          id="salaryMax"
          type="number"
          min={0}
          {...register('salaryMax', {
            setValueAs: (value) =>
              value === '' || value == null || Number.isNaN(Number(value)) ? null : Number(value),
          })}
        />
      </FormField>
    </div>
  )
}
