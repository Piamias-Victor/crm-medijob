import { AlertTriangle, UserPlus } from 'lucide-react'
import { InterimHomeAlertCard } from '@/components/molecules/InterimHomeAlertCard'
import type {
  HomeAlertCandidateItem,
  HomeAlertMissionItem,
} from '@/view-models/interim-home-alerts'

type Props = {
  unfilledThisWeek: { count: number; href: string; rows: HomeAlertMissionItem[] }
  newCandidates: { count: number; href: string; rows: HomeAlertCandidateItem[] }
}

export function InterimHomeAlerts({ unfilledThisWeek, newCandidates }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-fg">Pilotage intérim</h2>
        <p className="mt-1 text-sm text-fg-muted">Alertes à traiter — listes + filtres.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <InterimHomeAlertCard
          icon={AlertTriangle}
          title="Missions non pourvues cette semaine"
          count={unfilledThisWeek.count}
          href={unfilledThisWeek.href}
          hint="Ouvre Besoins filtrés sur la semaine en cours"
          rows={unfilledThisWeek.rows.map((row) => ({
            id: row.id,
            title: row.pharmacyName,
            subtitle: `${row.jobTitleLabel} · ${row.periodLabel}`,
            href: row.href,
          }))}
        />
        <InterimHomeAlertCard
          icon={UserPlus}
          title="Nouveaux candidats (< 24 h)"
          count={newCandidates.count}
          href={newCandidates.href}
          hint="Ouvre Candidats créés depuis moins de 24 heures"
          rows={newCandidates.rows.map((row) => ({
            id: row.id,
            title: row.name,
            subtitle: row.jobTitle ?? '—',
            href: row.href,
          }))}
        />
      </div>
    </div>
  )
}
