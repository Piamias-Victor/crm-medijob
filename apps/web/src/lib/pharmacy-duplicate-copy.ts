export const PHARMACY_DUPLICATE_MERGE_SUCCESS = 'Pharmacies fusionnées'
export const PHARMACY_DUPLICATE_CREATE_SUCCESS = 'Pharmacie créée malgré le doublon'
export const PHARMACY_DUPLICATE_REVIEW_EXPIRED = 'Session de revue expirée — relancez l’import.'
export const PHARMACY_DUPLICATE_REVIEW_LOADING = 'Chargement de la fiche existante…'
export const PHARMACY_DUPLICATE_REVIEW_TITLE = 'Revue de doublon'
export const PHARMACY_DUPLICATE_SECTION_TITLE = 'Comparer et fusionner'
export const PHARMACY_DUPLICATE_SECTION_DESCRIPTION =
  'Choisissez les champs à conserver, ou ignorez pour créer une nouvelle fiche.'
export const PHARMACY_DUPLICATE_PICKER_HELP =
  'Plusieurs pharmacies correspondent — choisissez celle à fusionner.'

export function pharmacyDuplicateReasonLabel(reason: 'siret' | 'name_city_postal'): string {
  return reason === 'siret' ? 'SIRET' : 'Nom + ville + CP'
}
