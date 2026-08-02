import type { MissionTab } from '@/view-models/mission-tabs'

const TABS: readonly MissionTab[] = [
  'infos',
  'pipeline',
  'matching',
  'offre',
  'historique',
  'documents',
]

export function parseMissionTab(value: string | undefined): MissionTab {
  return TABS.includes(value as MissionTab) ? (value as MissionTab) : 'infos'
}
