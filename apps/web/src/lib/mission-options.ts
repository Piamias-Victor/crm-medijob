import type { MissionStatus } from '@prisma/client'
import { MISSION_STATUS_THEME, type MissionStatusTheme } from '@/lib/mission-status-theme'

export const MISSION_STATUS_ORDER = [
  'A_POURVOIR',
  'EN_RECHERCHE',
  'CANDIDATS_PRESENTES',
  'ENTRETIEN_EN_COURS',
  'POURVU',
  'ANNULEE',
] as const satisfies readonly MissionStatus[]

export const STATUS_LABELS: Record<MissionStatus, string> = {
  A_POURVOIR: 'À pourvoir',
  EN_RECHERCHE: 'En recherche',
  CANDIDATS_PRESENTES: 'Candidats présentés',
  ENTRETIEN_EN_COURS: 'Entretien en cours',
  POURVU: 'Pourvu',
  ANNULEE: 'Annulée',
}

export const STATUS_BADGE: Record<MissionStatus, MissionStatusTheme['badge']> = {
  A_POURVOIR: MISSION_STATUS_THEME.A_POURVOIR.badge,
  EN_RECHERCHE: MISSION_STATUS_THEME.EN_RECHERCHE.badge,
  CANDIDATS_PRESENTES: MISSION_STATUS_THEME.CANDIDATS_PRESENTES.badge,
  ENTRETIEN_EN_COURS: MISSION_STATUS_THEME.ENTRETIEN_EN_COURS.badge,
  POURVU: MISSION_STATUS_THEME.POURVU.badge,
  ANNULEE: MISSION_STATUS_THEME.ANNULEE.badge,
}
