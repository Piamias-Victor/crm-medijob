export const DUPLICATE_PROBE_ERROR = 'Impossible de vérifier les doublons. Réessayez.'
export const DUPLICATE_MERGE_SUCCESS = 'Candidat fusionné'
export const DUPLICATE_CREATE_SUCCESS = 'Candidat créé'
export const DUPLICATE_UPDATE_SUCCESS = 'Candidat mis à jour'
export const DUPLICATE_REASON_EMAIL = 'Email identique'
export const DUPLICATE_REASON_NAME_PHONE = 'Prénom + nom + téléphone'
export const DUPLICATE_REASON_PHONE = 'Téléphone identique'

export function duplicateReasonLabel(reason: 'email' | 'name_phone' | 'phone') {
  if (reason === 'email') return DUPLICATE_REASON_EMAIL
  if (reason === 'phone') return DUPLICATE_REASON_PHONE
  return DUPLICATE_REASON_NAME_PHONE
}

export function duplicateMatchLabel(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`.trim()
}
