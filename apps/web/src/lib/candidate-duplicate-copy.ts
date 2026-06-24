export const DUPLICATE_PROBE_ERROR = 'Impossible de vérifier les doublons. Réessayez.'
export const DUPLICATE_MERGE_SUCCESS = 'Candidat fusionné'
export const DUPLICATE_CREATE_SUCCESS = 'Candidat créé'
export const DUPLICATE_UPDATE_SUCCESS = 'Candidat mis à jour'
export const DUPLICATE_REASON_EMAIL = 'Email identique'
export const DUPLICATE_REASON_NAME_PHONE = 'Prénom + nom + téléphone'

export function duplicateReasonLabel(reason: 'email' | 'name_phone') {
  return reason === 'email' ? DUPLICATE_REASON_EMAIL : DUPLICATE_REASON_NAME_PHONE
}

export function duplicateMatchLabel(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`.trim()
}
