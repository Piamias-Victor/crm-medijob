import type { DevisKind } from './devis-draft'

export function kindFromContract(
  contractType: 'CDI' | 'CDD' | 'INTERIM' | 'VACATION',
): DevisKind {
  if (contractType === 'CDI' || contractType === 'CDD') return contractType
  return 'INTERIM'
}
