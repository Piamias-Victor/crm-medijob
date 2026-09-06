import Link from 'next/link'
import { SuiviMissionRow } from '@/components/molecules/SuiviMissionRow'
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
            <SuiviMissionRow key={row.id} row={row} />
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
