import Link from 'next/link'
import { AlertTriangle, UserPlus } from 'lucide-react'

type AlertCard = {
  title: string
  count: number
  href: string
  hint: string
  icon: typeof AlertTriangle
}

type Props = {
  unfilledThisWeek: { count: number; href: string }
  newCandidates: { count: number; href: string }
}

function Card({ title, count, href, hint, icon: Icon }: AlertCard) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-3 rounded-xl border border-border/70 bg-white p-5 shadow-sm transition-colors hover:border-accent/40 hover:bg-accent-muted/10"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex size-9 items-center justify-center rounded-lg bg-accent-muted text-accent">
          <Icon className="size-4" aria-hidden />
        </span>
        <span className="text-3xl font-bold tabular-nums text-fg">{count}</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-fg">{title}</p>
        <p className="mt-1 text-xs text-fg-muted">{hint}</p>
      </div>
    </Link>
  )
}

export function InterimHomeAlerts({ unfilledThisWeek, newCandidates }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-fg">Pilotage intérim</h2>
        <p className="mt-1 text-sm text-fg-muted">Alertes à traiter — cliquez pour filtrer.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Card
          icon={AlertTriangle}
          title="Missions non pourvues cette semaine"
          count={unfilledThisWeek.count}
          href={unfilledThisWeek.href}
          hint="Ouvre Besoins filtrés sur la semaine en cours"
        />
        <Card
          icon={UserPlus}
          title="Nouveaux candidats (< 24 h)"
          count={newCandidates.count}
          href={newCandidates.href}
          hint="Ouvre Candidats créés depuis moins de 24 heures"
        />
      </div>
    </div>
  )
}
