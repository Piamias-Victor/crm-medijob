import Link from 'next/link'
import { Badge } from '@/components/atoms/Badge'
import { badakanMissionStepVariant } from '@/view-models/badakan-mission-step'
import { suiviFamilyHref, type SuiviFamily } from '@/view-models/suivi-family-href'
import type { SuiviBuckets, SuiviMissionItem } from '@/view-models/badakan-suivi'

type Props = { buckets: SuiviBuckets }

function MissionList({
  title,
  family,
  rows,
}: {
  title: string
  family: SuiviFamily
  rows: SuiviMissionItem[]
}) {
  return (
    <section className="min-w-0 rounded-xl border border-border/70 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-fg">
        <Link href={suiviFamilyHref(family)} className="hover:text-accent-hover hover:underline">
          {title} <span className="text-fg-muted">({rows.length})</span>
        </Link>
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
  const { open, proposed, staffed } = buckets
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <MissionList title="À pourvoir" family="open" rows={open} />
      <MissionList title="Proposés" family="proposed" rows={proposed} />
      <MissionList title="Staffés" family="staffed" rows={staffed} />
    </div>
  )
}
