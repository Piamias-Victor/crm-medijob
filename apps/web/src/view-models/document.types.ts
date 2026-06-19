export const DOCUMENT_CATEGORIES = ['CONTRAT', 'DEVIS', 'FACTURE', 'CONVENTION', 'AUTRE'] as const

export type DocumentCategoryValue = (typeof DOCUMENT_CATEGORIES)[number]
