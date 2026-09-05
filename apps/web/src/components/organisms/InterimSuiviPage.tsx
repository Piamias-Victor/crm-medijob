import Link from 'next/link'
import { Badge } from '@/components/atoms/Badge'
import { badakanMissionStepVariant } from '@/view-models/badakan-mission-step'
import type { SuiviBuckets, SuiviMissionItem } from '@/view-models/badakan-suivi'

type Props = { buckets: SuiviBuckets }

function Stat({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className={`rounded-xl border p-4 ${tone}`}>
      <p className="text-2xl font-bold tabular-nums text-fg">{value}</p>
      <p className="mt-1 text-xs font-medium text-fg-muted">{label}</p>
    </div>
  )
}

function MissionList({ title, rows }: { title: string; rows: SuiviMissionItem[] }) {
  return (
    <section className="min-w-0 rounded-xl border border-border/70 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-fg">
        {title}{' '}
        <span className="text-fg-muted">({rows.length})</span>
      </h2>
      {rows.length === 0 ? (
        <p className="text-sm text-fg-muted">Aucune mission.</p>
      ) : (
        <ul className="divide-y divide-border/50">
          {rows.map((row) => (
            <li key={row.id}>
              <Link
                href={row.href}
                className="flex items-center justify-between gap-3 py-2.5 hover:bg-accent-muted/20"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-fg">
                    {row.pharmacyName}
                  </span>
                  <span className="block truncate text-xs text-fg-muted">
                    {row.jobTitleLabel} · {row.cityLabel} · {row.periodLabel}
                  </span>
                </span>
                <Badge variant={badakanMissionStepVariant(row.step)}>{row.stepLabel}</Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export function InterimSuiviPage({ buckets }: Props) {
  const { open, proposed, staffed, counts } = buckets
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Besoins non pourvus" value={counts.open} tone="border-border/70 bg-white" />
        <Stat
          label="Avec proposition"
          value={counts.proposed}
          tone="border-warning/30 bg-warning/5"
        />
        <Stat label="Staffés (validés)" value={counts.staffed} tone="border-success/30 bg-success/5" />
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <MissionList title="À pourvoir" rows={open} />
        <MissionList title="Proposés" rows={proposed} />
        <MissionList title="Staffés" rows={staffed} />
      </div>
    </div>
  )
}
