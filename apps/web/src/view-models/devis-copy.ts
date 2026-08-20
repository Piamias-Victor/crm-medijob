import type { DevisKind } from '@/lib/finance/devis-draft'

export const DEVIS_KIND_LABELS: Record<DevisKind, string> = {
  INTERIM: 'Intérim',
  CDD: 'CDD',
  CDI: 'CDI',
}

export const DEVIS_SAVE_SUCCESS = 'Devis enregistré'
export const DEVIS_SAVE_LABEL = 'Enregistrer le brouillon'
export const DEVIS_SAVING_LABEL = 'Enregistrement…'
export const DEVIS_SEND_LABEL = 'Envoyer'
export const DEVIS_SENDING_LABEL = 'Envoi…'
export const DEVIS_SEND_SUCCESS = 'Devis envoyé'
export const DEVIS_SENT_LOG = 'Devis envoyé'
export const DEVIS_DELETE_LABEL = 'Supprimer le brouillon'
export const DEVIS_DELETING_LABEL = 'Suppression…'
export const DEVIS_DELETE_SUCCESS = 'Brouillon supprimé'
export const DEVIS_CURRENT_LABEL = 'Devis courant'
export const MARGE_LABEL = 'Marge (€)'
export const MARGE_SAVE_LABEL = 'Enregistrer la marge'
export const MARGE_SAVE_SUCCESS = 'Marge enregistrée'
