import type { DevisKind, HtSource } from '@/lib/finance/devis-draft'
import { kindFromContract } from '@/lib/finance/devis-kind'
import type { DevisView } from '@/view-models/devis'

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
