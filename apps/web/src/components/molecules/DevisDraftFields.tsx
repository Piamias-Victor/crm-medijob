'use client'

import type { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form'
import { DEVIS_KINDS } from '@/lib/finance/devis-draft'
import { ttcFromHt } from '@/lib/finance/calculate-interim-libre'
import { DEVIS_KIND_LABELS } from '@/view-models/devis-copy'
import type { DevisFormValues } from '@/view-models/devis-form'
import { Input } from '@/components/atoms/Input'
import { Select } from '@/components/atoms/Select'
import { FormField } from '@/components/molecules/FormField'

type Props = {
  register: UseFormRegister<DevisFormValues>
  setValue: UseFormSetValue<DevisFormValues>
  watch: UseFormWatch<DevisFormValues>
  errors: FieldErrors<DevisFormValues>
}

export function DevisDraftFields({ register, setValue, watch, errors }: Props) {
  const kind = watch('kind')
  const amountHt = watch('amountHt')
  const ttc = amountHt == null ? null : ttcFromHt(amountHt)

  return (
    <>
      <FormField label="Type" htmlFor="devis-kind" error={errors.kind?.message}>
        <Select
          id="devis-kind"
          value={kind}
          onChange={(event) => setValue('kind', event.target.value as DevisFormValues['kind'])}
        >
          {DEVIS_KINDS.map((value) => (
            <option key={value} value={value}>
              {DEVIS_KIND_LABELS[value]}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField label="Heures" htmlFor="devis-hours" error={errors.hours?.message}>
        <Input id="devis-hours" type="number" min={0} step="0.01" {...register('hours')} />
      </FormField>
      {kind === 'INTERIM' ? (
        <FormField label="Taux horaire HT (€)" htmlFor="devis-rate" error={errors.hourlyRate?.message}>
          <Input id="devis-rate" type="number" min={0} step="0.01" {...register('hourlyRate')} />
        </FormField>
      ) : null}
      <FormField label="Total HT (€)" htmlFor="devis-ht" error={errors.amountHt?.message}>
        <Input
          id="devis-ht"
          type="number"
          min={0}
          step="0.01"
          {...register('amountHt', {
            onChange: () => setValue('htSource', 'TYPED'),
          })}
        />
      </FormField>
      <FormField label="Total TTC (€)">
        <Input readOnly value={ttc ?? ''} tabIndex={-1} />
      </FormField>
    </>
  )
}
