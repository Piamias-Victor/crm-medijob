export const APP_INTAKE_STATUSES = [
  'A_APPELER',
  'DOSSIER_INCOMPLET',
  'A_RELANCER',
  'HORS_ZONE',
] as const

export type AppIntakeStatus = (typeof APP_INTAKE_STATUSES)[number]

export const APP_CALL_OUTCOMES = [
  'MESSAGERIE',
  'RDV_PRIS',
  'A_RAPPELER',
  'PAS_INTERESSE',
  'HORS_CIBLE',
  'PAS_DE_REPONSE',
] as const

export type AppCallOutcome = (typeof APP_CALL_OUTCOMES)[number]

export const DEFAULT_APP_INTAKE_STATUS: AppIntakeStatus = 'A_APPELER'
