import type { DevisKind } from '@/lib/finance/devis-draft'

export const DEVIS_KIND_LABELS: Record<DevisKind, string> = {
  INTERIM: 'Intérim',
  CDD: 'CDD',
  CDI: 'CDI',
}

export const DEVIS_SAVE_SUCCESS = 'Devis enregistré'
export const DEVIS_SAVE_LABEL = 'Enregistrer le brouillon'
export const MARGE_LABEL = 'Marge (€)'
export const MARGE_SAVE_LABEL = 'Enregistrer la marge'
export const MARGE_SAVE_SUCCESS = 'Marge enregistrée'
