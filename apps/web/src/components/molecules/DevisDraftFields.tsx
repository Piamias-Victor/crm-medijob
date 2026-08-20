'use client'

import type {
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'
import { parseAmount, ttcFromHt } from '@/lib/finance/calculate-interim-libre'
import type { LinkedField } from '@/lib/finance/devis-draft'
import { linkDevisField, type DevisFormValues } from '@/view-models/devis-form'
import { Input } from '@/components/atoms/Input'
import { FormField } from '@/components/molecules/FormField'
import { DevisKindField } from '@/components/molecules/DevisKindField'

type Props = {
  register: UseFormRegister<DevisFormValues>
  setValue: UseFormSetValue<DevisFormValues>
  getValues: UseFormGetValues<DevisFormValues>
  watch: UseFormWatch<DevisFormValues>
  errors: FieldErrors<DevisFormValues>
}

export function DevisDraftFields({ register, setValue, getValues, watch, errors }: Props) {
  const amountHt = parseAmount(watch('amountHt'))
  const ttc = amountHt == null ? '' : ttcFromHt(amountHt)

  const patch = (changed: LinkedField) => {
    const next = linkDevisField(getValues(), changed)
    setValue('htSource', next.htSource)
    if (changed !== 'hourlyRate') setValue('hourlyRate', next.hourlyRate)
    if (changed !== 'amountHt') setValue('amountHt', next.amountHt)
  }

  return (
    <>
      <DevisKindField
        value={watch('kind')}
        onChange={(kind) => setValue('kind', kind)}
        error={errors.kind?.message}
      />
      <FormField label="Heures" htmlFor="devis-hours" error={errors.hours?.message}>
        <Input
          id="devis-hours"
          type="number"
          min={0}
          step="0.01"
          {...register('hours', { onChange: () => patch('hours') })}
        />
      </FormField>
      <FormField label="Taux horaire HT (€)" htmlFor="devis-rate" error={errors.hourlyRate?.message}>
        <Input
          id="devis-rate"
          type="number"
          min={0}
          step="0.01"
          {...register('hourlyRate', { onChange: () => patch('hourlyRate') })}
        />
      </FormField>
      <FormField label="Total HT (€)" htmlFor="devis-ht" error={errors.amountHt?.message}>
        <Input
          id="devis-ht"
          type="number"
          min={0}
          step="0.01"
          {...register('amountHt', { onChange: () => patch('amountHt') })}
        />
      </FormField>
      <FormField label="Total TTC (€)">
        <Input readOnly value={ttc} tabIndex={-1} />
      </FormField>
    </>
  )
}
