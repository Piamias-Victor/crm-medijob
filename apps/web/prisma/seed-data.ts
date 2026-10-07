// Données référentielles seedées (SPEC_V2 §10).

import { T4S_CONTACT_ROLES, T4S_GROUPEMENTS, T4S_SOFTWARES } from './seed-t4s-data'

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
  ...T4S_SOFTWARES,
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
  ...T4S_GROUPEMENTS,
] as const

export const JOB_TITLES = [
  'Pharmacien',
  'Préparateur',
  'Étudiant en pharmacie',
  'Conseiller parapharmacie',
  'Rayonniste',
  'Apprenti préparateur',
  'Autre',
] as const

export const JOB_TITLE_RENAMES = [
  ['Étudiant pharma', 'Étudiant en pharmacie'],
  ['Rayoniste', 'Rayonniste'],
] as const

export const JOB_TITLE_PROFILE_KEYS: Record<(typeof JOB_TITLES)[number], string | null> = {
  Pharmacien: 'pharmacien',
  Préparateur: 'preparateur',
  'Étudiant en pharmacie': 'etudiant',
  'Conseiller parapharmacie': 'conseiller_para',
  Rayonniste: 'rayonniste',
  'Apprenti préparateur': null,
  Autre: null,
}

export const INTERVIEW_PROFILE_KEYS = [
  'pharmacien',
  'preparateur',
  'etudiant',
  'conseiller_para',
  'rayonniste',
] as const

export const CONTACT_ROLES = [
  'Titulaire',
  'Pharmacien adjoint',
  'Préparateur référent',
  'Responsable RH',
  'Comptabilité',
  ...T4S_CONTACT_ROLES,
  'Autre',
] as const

// Matrice compatibilité : métier mission → métiers candidats acceptés.
export const COMPATIBILITY: Record<string, readonly string[]> = {
  Pharmacien: ['Pharmacien'],
  Préparateur: ['Préparateur', 'Étudiant en pharmacie', 'Apprenti préparateur'],
  'Étudiant en pharmacie': ['Étudiant en pharmacie'],
  'Conseiller parapharmacie': ['Conseiller parapharmacie'],
  Rayonniste: ['Rayonniste'],
  'Apprenti préparateur': ['Apprenti préparateur'],
  Autre: [
    'Pharmacien',
    'Préparateur',
    'Étudiant en pharmacie',
    'Conseiller parapharmacie',
    'Rayonniste',
    'Apprenti préparateur',
    'Autre',
  ],
}
