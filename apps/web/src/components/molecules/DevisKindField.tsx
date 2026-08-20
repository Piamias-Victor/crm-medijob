'use client'

import { Combobox } from '@/components/molecules/Combobox'
import { FormField } from '@/components/molecules/FormField'
import { parseDevisKind, DEVIS_KIND_OPTIONS } from '@/view-models/devis-form'
import type { DevisKind } from '@/lib/finance/devis-draft'

type Props = {
  value: DevisKind
  onChange: (kind: DevisKind) => void
  error?: string
}

export function DevisKindField({ value, onChange, error }: Props) {
  return (
    <FormField label="Type" error={error}>
      <Combobox
        value={value}
        onChange={(next) => onChange(parseDevisKind(next))}
        options={DEVIS_KIND_OPTIONS}
        placeholder="Type de contrat"
      />
    </FormField>
  )
}
