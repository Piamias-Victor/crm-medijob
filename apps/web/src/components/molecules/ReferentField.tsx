'use client'

import { Combobox } from '@/components/molecules/Combobox'
import { FormField } from '@/components/molecules/FormField'
import { buildReferentSelectOptions } from '@/view-models/referent-select-options'

type Ref = { id: string; name: string }

type Props = {
  value?: string | null
  onChange: (value: string | null) => void
  recruiters: readonly Ref[]
  error?: string
  emptyLabel?: string
}

export function ReferentField({ value, onChange, recruiters, error, emptyLabel }: Props) {
  return (
    <FormField label="Référent" error={error}>
      <Combobox
        value={value ?? ''}
        onChange={(next) => onChange(next || null)}
        options={buildReferentSelectOptions(recruiters, emptyLabel)}
        placeholder="Choisir un référent"
      />
    </FormField>
  )
}
