import type { MissionStatus } from '@prisma/client'

// Étapes terminales du pipeline (ADR 0001) — exclues des kanbans actifs.
export const TERMINAL_STAGE_NAMES = ['Placé', 'Pas retenu'] as const

// Statuts mission terminaux (SPEC_V2 §10) — exclus des cartes CVthèque.
export const TERMINAL_MISSION_STATUSES = [
  'POURVU',
  'ANNULEE',
] as const satisfies readonly MissionStatus[]
