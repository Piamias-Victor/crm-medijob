import { Briefcase } from 'lucide-react'
import { cn } from '@/lib/cn'
import { EmptyState } from '@/components/atoms/EmptyState'
import { MissionStatusBadge } from '@/components/molecules/MissionStatusBadge'
import { toMissionListItems, type RawMission } from '@/view-models/mission-kanban'

const HEADERS = ['Titre', 'Métier', 'Pharmacie', 'Ville', 'Statut', 'Référent', 'Date début']

function formatDate(value: Date) {
  return new Intl.DateTimeFormat('fr-FR').format(value)
}

type Props = { missions: RawMission[]; embedded?: boolean }

export function MissionList({ missions, embedded = false }: Props) {
  const rows = toMissionListItems(missions)

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={Briefcase}
        title="Aucune mission"
        description="Les besoins de staffing apparaîtront ici."
      />
    )
  }

  return (
    <div
      className={cn(
        'overflow-x-auto',
        embedded ? '-mx-1' : 'rounded-lg border border-border bg-white',
      )}
    >
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-gradient-to-r from-accent-muted/40 via-surface to-surface text-left text-fg-muted">
          <tr>
            {HEADERS.map((header) => (
              <th key={header} className="px-4 py-3 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3 font-medium text-fg">{row.title}</td>
              <td className="px-4 py-3 text-fg-muted">{row.jobTitle ?? '—'}</td>
              <td className="px-4 py-3 text-fg-muted">{row.pharmacyName}</td>
              <td className="px-4 py-3 text-fg-muted">{row.city ?? '—'}</td>
              <td className="px-4 py-3">
                <MissionStatusBadge status={row.status} />
              </td>
              <td className="px-4 py-3 text-fg-muted">{row.referent ?? '—'}</td>
              <td className="px-4 py-3 text-fg-muted">{formatDate(row.startDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
