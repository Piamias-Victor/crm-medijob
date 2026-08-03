import { BEST_PROFILES_TOP_N } from '@/lib/constants/assistant-week-report'
import { assembleWeekReportStats } from '@/server/ai/week-report-assemble'
import type { WeekReportCountsLoader } from '@/server/ai/week-report-assemble'
import { formatWeekReportContext } from '@/server/ai/week-report-format'
import { formatBestProfilesContext } from '@/server/ai/best-profiles-format'
import type { MissionMatchingDeps } from '@/server/matching/run-mission-matching'
import { runMissionMatching } from '@/server/matching/run-mission-matching'
import type { AssistantContext } from '@/server/ai/request'
import type { Shortcut } from '@/server/ai/shortcuts'

export type ShortcutContextDeps = {
  weekReport?: WeekReportCountsLoader
  matching?: MissionMatchingDeps
  referentId?: string
  now?: Date
}

export async function loadShortcutExtraContext(
  shortcut: Shortcut | undefined,
  context: AssistantContext | undefined,
  deps: ShortcutContextDeps,
): Promise<string | null> {
  if (!shortcut) return null
  if (shortcut.id === 'week-report') return loadWeekReportContext(deps)
  if (shortcut.id === 'best-profiles') return loadBestProfilesContext(context, deps)
  return null
}

async function loadWeekReportContext(deps: ShortcutContextDeps): Promise<string> {
  if (!deps.weekReport || !deps.referentId) throw new Error('WEEK_REPORT_UNAVAILABLE')
  const stats = await assembleWeekReportStats(deps.weekReport, {
    referentId: deps.referentId,
    now: deps.now ?? new Date(),
  })
  return formatWeekReportContext(stats)
}

async function loadBestProfilesContext(
  context: AssistantContext | undefined,
  deps: ShortcutContextDeps,
): Promise<string> {
  if (context?.entityType !== 'mission' || !context.entityId) {
    throw new Error('BEST_PROFILES_MISSION_REQUIRED')
  }
  if (!deps.matching) throw new Error('BEST_PROFILES_UNAVAILABLE')
  const result = await runMissionMatching(context.entityId, deps.matching)
  if (!result) throw new Error('MISSION_NOT_FOUND')
  return formatBestProfilesContext({
    scored: result.scored,
    topN: BEST_PROFILES_TOP_N,
  })
}
