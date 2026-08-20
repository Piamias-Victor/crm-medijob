import { parseAmount } from '@/lib/finance/calculate-interim-libre'
import {
  applyLinkedAmounts,
  DEVIS_KINDS,
  type DevisKind,
  type HtSource,
  type LinkedField,
} from '@/lib/finance/devis-draft'
import { kindFromContract } from '@/lib/finance/devis-kind'
import type { ComboboxOption } from '@/components/molecules/ComboboxDropdown.types'
import { DEVIS_KIND_LABELS } from '@/view-models/devis-copy'
import type { DevisView } from '@/view-models/devis'

export const DEVIS_KIND_OPTIONS: ComboboxOption[] = DEVIS_KINDS.map((value) => ({
  value,
  label: DEVIS_KIND_LABELS[value],
}))

export function parseDevisKind(value: string): DevisKind {
  return DEVIS_KINDS.find((kind) => kind === value) ?? 'INTERIM'
}

export type DevisFormValues = {
  kind: DevisKind
  hours: number | null
  hourlyRate: number | null
  amountHt: number | null
  htSource: HtSource
}

export type DevisFormDefaults = {
  contractType: 'CDI' | 'CDD' | 'INTERIM' | 'VACATION'
  hours: number | null
}

export function toDevisFormValues(
  devis: DevisView | null,
  defaults: DevisFormDefaults,
): DevisFormValues {
  if (devis) {
    return {
      kind: devis.kind,
      hours: devis.hours,
      hourlyRate: devis.hourlyRate,
      amountHt: devis.amountHt,
      htSource: devis.htSource,
    }
  }
  return {
    kind: kindFromContract(defaults.contractType),
    hours: defaults.hours,
    hourlyRate: null,
    amountHt: null,
    htSource: 'TYPED',
  }
}

export function linkDevisField(values: DevisFormValues, changed: LinkedField): DevisFormValues {
  const next = applyLinkedAmounts(
    {
      kind: values.kind,
      hours: parseAmount(values.hours),
      hourlyRate: parseAmount(values.hourlyRate),
      amountHt: parseAmount(values.amountHt),
      amountTtc: null,
      htSource: values.htSource,
    },
    changed,
  )
  return {
    kind: next.kind,
    hours: next.hours,
    hourlyRate: next.hourlyRate,
    amountHt: next.amountHt,
    htSource: next.htSource,
  }
}
