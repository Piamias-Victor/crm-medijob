import type { WeekReportStats } from '@/server/ai/week-report-assemble'

export function formatWeekReportContext(stats: WeekReportStats): string {
  return [
    'Métriques CRM (semaine ISO, Europe/Paris) — ne pas inventer d’autres chiffres.',
    `référent: ${stats.referentId}`,
    `période: ${stats.from.toISOString()} → ${stats.to.toISOString()} (fin exclusive)`,
    `missions ouvertes: ${stats.missionsOpen}`,
    `missions pourvues (semaine): ${stats.missionsFilled}`,
    `candidats contactés: ${stats.candidatesContacted}`,
    `candidatures reçues: ${stats.applicationsReceived}`,
    `offres publiées: ${stats.offersPublished}`,
    `actions commerciales: ${stats.commercialActions}`,
  ].join('\n')
}
