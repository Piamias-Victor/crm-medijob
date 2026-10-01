export const OFFER_SECTION_TITLES = [
  'RÉSUMÉ DU POSTE',
  'MISSIONS DU POSTE',
  'PROFIL RECHERCHÉ',
  'INFORMATIONS COMPLÉMENTAIRES',
] as const

export type OfferSections = {
  resume: string
  missions: string[]
  profil: string[]
  infos: string[]
}
