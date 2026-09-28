import type { AppCallOutcome, AppIntakeStatus } from './app-profile-intake.enums'

export const APP_INTAKE_STATUS_LABELS: Record<AppIntakeStatus, string> = {
  A_APPELER: 'À appeler',
  DOSSIER_INCOMPLET: 'Dossier incomplet',
  A_RELANCER: 'À relancer',
  HORS_ZONE: 'Hors zone',
}

export const APP_CALL_OUTCOME_LABELS: Record<AppCallOutcome, string> = {
  MESSAGERIE: 'Messagerie',
  RDV_PRIS: 'RDV pris',
  A_RAPPELER: 'À rappeler',
  PAS_INTERESSE: 'Pas intéressé',
  HORS_CIBLE: 'Hors cible',
  PAS_DE_REPONSE: 'Pas de réponse',
}
