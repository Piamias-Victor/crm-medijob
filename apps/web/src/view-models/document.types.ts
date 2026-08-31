export const DOCUMENT_CATEGORIES = [
  'CONTRAT',
  'DEVIS',
  'FACTURE',
  'CONVENTION',
  'AUTRE',
  'CNI',
  'RIB',
  'DIPLOME',
] as const

export type DocumentCategoryValue = (typeof DOCUMENT_CATEGORIES)[number]
