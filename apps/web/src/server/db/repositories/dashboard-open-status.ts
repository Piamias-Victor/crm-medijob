import type { MissionStatus } from '@prisma/client'
import { TERMINAL_MISSION_STATUSES } from '@/lib/pipeline-constants'

export const OPEN_MISSION_STATUSES = [
  'A_POURVOIR',
  'EN_RECHERCHE',
  'CANDIDATS_PRESENTES',
  'ENTRETIEN_EN_COURS',
] as const satisfies readonly MissionStatus[]

export const TERMINAL_STATUSES = TERMINAL_MISSION_STATUSES
