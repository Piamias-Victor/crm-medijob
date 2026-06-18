// Données référentielles seedées (SPEC_V2 §10).

export const PIPELINE_STAGES = [
  'Nouveau',
  'Contacté',
  'Entretien',
  'Proposition',
  'Placé',
  'Pas retenu',
] as const

export const SOFTWARES = [
  'Winpharma',
  'LGPI',
  'Smart Rx',
  'LEO',
  'Pharmaland',
  'Crystal',
  'Pharmavitale',
  'Esope',
] as const

export const GROUPEMENTS = [
  'Giphar',
  'Alphega',
  'Pharmabest',
  'Leadersanté',
  'Aprium',
  'Pharmavie',
  'Welcoop',
  'Elsie Santé',
] as const

export const JOB_TITLES = [
  'Pharmacien',
  'Préparateur',
  'Étudiant pharma',
  'Rayoniste',
  'Autre',
] as const

// Matrice compatibilité : métier mission → métiers candidats acceptés.
export const COMPATIBILITY: Record<string, readonly string[]> = {
  Pharmacien: ['Pharmacien'],
  Préparateur: ['Préparateur', 'Étudiant pharma'],
  'Étudiant pharma': ['Étudiant pharma'],
  Rayoniste: ['Rayoniste'],
  Autre: ['Pharmacien', 'Préparateur', 'Étudiant pharma', 'Rayoniste', 'Autre'],
}
