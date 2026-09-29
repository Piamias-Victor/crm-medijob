export const DEFAULT_APP_INTAKE_STATUS_ID = 'A_APPELER'

/** Stable seed ids — kept for migration / soft-hide / syncro defaults. */
export const SEEDED_INTAKE_STATUS_IDS = [
  'A_APPELER',
  'DOSSIER_INCOMPLET',
  'A_RELANCER',
  'HORS_ZONE',
] as const

export type SeededIntakeStatusId = (typeof SEEDED_INTAKE_STATUS_IDS)[number]

export const APP_CALL_OUTCOMES = [
  'MESSAGERIE',
  'RDV_PRIS',
  'A_RAPPELER',
  'PAS_INTERESSE',
  'HORS_CIBLE',
  'PAS_DE_REPONSE',
] as const

export type AppCallOutcome = (typeof APP_CALL_OUTCOMES)[number]

/** @deprecated use DEFAULT_APP_INTAKE_STATUS_ID */
export const DEFAULT_APP_INTAKE_STATUS = DEFAULT_APP_INTAKE_STATUS_ID

/** @deprecated use SEEDED_INTAKE_STATUS_IDS */
export const APP_INTAKE_STATUSES = SEEDED_INTAKE_STATUS_IDS

/** @deprecated */
export type AppIntakeStatus = SeededIntakeStatusId
