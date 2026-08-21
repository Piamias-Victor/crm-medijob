'use client'

import type { UseFormReturn } from 'react-hook-form'
import { parseAmount, ttcFromHt } from '@/lib/finance/calculate-interim-libre'
import { linkFinanceLineAmounts } from '@/view-models/finance-line-amounts'
import type { LinkedField } from '@/lib/finance/devis-draft'
import type { FinanceLineFormValues } from '@/view-models/finance-line-form'
import { Input } from '@/components/atoms/Input'
import { FormField } from '@/components/molecules/FormField'

type Props = { form: UseFormReturn<FinanceLineFormValues> }

export function FinanceLineAmountFields({ form }: Props) {
  const { watch, setValue, register, getValues, formState } = form
  const errors = formState.errors
  const amountHt = parseAmount(watch('amountHt'))
  const ttc = amountHt == null ? '' : ttcFromHt(amountHt)

  const patch = (changed: LinkedField) => {
    const next = linkFinanceLineAmounts(getValues(), changed)
    setValue('htSource', next.htSource)
    if (changed !== 'hourlyRate') setValue('hourlyRate', next.hourlyRate)
    if (changed !== 'amountHt') setValue('amountHt', next.amountHt)
  }

  return (
    <>
      <FormField label="Heures (optionnel)" htmlFor="line-hours" error={errors.hours?.message}>
        <Input
          id="line-hours"
          type="number"
          min={0}
          step="0.01"
          {...register('hours', { onChange: () => patch('hours') })}
        />
      </FormField>
      <FormField label="Taux horaire HT (€)" htmlFor="line-rate" error={errors.hourlyRate?.message}>
        <Input
          id="line-rate"
          type="number"
          min={0}
          step="0.01"
          {...register('hourlyRate', { onChange: () => patch('hourlyRate') })}
        />
      </FormField>
      <FormField label="Total HT (€)" htmlFor="line-ht" error={errors.amountHt?.message}>
        <Input
          id="line-ht"
          type="number"
          min={0}
          step="0.01"
          {...register('amountHt', { onChange: () => patch('amountHt') })}
        />
      </FormField>
      <FormField label="Total TTC (€)">
        <Input readOnly value={ttc} tabIndex={-1} />
      </FormField>
      <FormField label="Marge" error={errors.marge?.message}>
        <Input id="marge" type="number" min="0" step="0.01" {...register('marge')} />
      </FormField>
    </>
  )
}
