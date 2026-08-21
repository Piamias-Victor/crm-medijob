'use client'

import type { UseFormReturn } from 'react-hook-form'
import { Combobox } from '@/components/molecules/Combobox'
import { DatePicker } from '@/components/molecules/DatePicker'
import { FormField } from '@/components/molecules/FormField'
import { Input } from '@/components/atoms/Input'
import { FINANCE_LINE_KIND_OPTIONS, type FinanceLineFormValues } from '@/view-models/finance-line-form'
import type { ComboboxOption } from '@/components/molecules/ComboboxDropdown.types'

type Props = {
  form: UseFormReturn<FinanceLineFormValues>
  pharmacies: ComboboxOption[]
  candidates: ComboboxOption[]
  missions: ComboboxOption[]
}

export function FinanceLineFormFields({ form, pharmacies, candidates, missions }: Props) {
  const { watch, setValue, register, formState } = form
  const errors = formState.errors
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField label="Pharmacie" error={errors.pharmacyId?.message}>
        <Combobox
          value={watch('pharmacyId')}
          onChange={(value) => setValue('pharmacyId', value, { shouldValidate: true })}
          options={pharmacies}
          placeholder="Choisir une pharmacie"
        />
      </FormField>
      <FormField label="Candidat" error={errors.candidateId?.message}>
        <Combobox
          value={watch('candidateId')}
          onChange={(value) => setValue('candidateId', value, { shouldValidate: true })}
          options={candidates}
          placeholder="Choisir un candidat"
        />
      </FormField>
      <FormField label="Mission (optionnel)" error={errors.missionId?.message}>
        <Combobox
          value={watch('missionId')}
          onChange={(value) => setValue('missionId', value)}
          options={missions}
          placeholder="Aucune mission"
        />
      </FormField>
      <FormField label="Type" error={errors.kind?.message}>
        <Combobox
          value={watch('kind')}
          onChange={(value) => {
            const kind = FINANCE_LINE_KIND_OPTIONS.find((option) => option.value === value)?.value
            if (kind) setValue('kind', kind, { shouldValidate: true })
          }}
          options={[...FINANCE_LINE_KIND_OPTIONS]}
          placeholder="Type"
        />
      </FormField>
      <FormField label="Date" error={errors.occurredAt?.message}>
        <DatePicker
          id="occurredAt"
          value={watch('occurredAt')}
          onChange={(value) => setValue('occurredAt', value ?? '', { shouldValidate: true })}
          emptyLabel="Choisir une date"
          clearLabel="Effacer"
          ariaLabel="Date de la ligne"
        />
      </FormField>
      <FormField label="Montant HT" error={errors.amountHt?.message}>
        <Input id="amountHt" type="number" min="0" step="0.01" {...register('amountHt')} />
      </FormField>
      <FormField label="Marge" error={errors.marge?.message}>
        <Input id="marge" type="number" min="0" step="0.01" {...register('marge')} />
      </FormField>
    </div>
  )
}
