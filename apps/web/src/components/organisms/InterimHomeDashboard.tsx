'use client'

import Link from 'next/link'
import { BadakanNeedList } from '@/components/organisms/BadakanNeedList'
import { InterimHomeDisponPanel } from '@/components/organisms/InterimHomeDisponPanel'
import { InterimSecondaryLinks } from '@/components/molecules/InterimSecondaryLinks'
import { InterimSuiviPage } from '@/components/organisms/InterimSuiviPage'
import type { AvailabilityFilterConfig } from '@/lib/filters/availability-filter-config'
import type { BadakanNeedListItem } from '@/view-models/badakan-need-list'
import type { DeclaredAvailabilityRow } from '@/view-models/weekly-availability-declared-row'
import type { AvailabilitySearchFilters } from '@/view-models/weekly-availability-search.schema'
import type { SuiviBuckets } from '@/view-models/badakan-suivi'

type Props = {
  needs: BadakanNeedListItem[]
  availabilityRows: DeclaredAvailabilityRow[]
  availabilityFilters: AvailabilitySearchFilters
  availabilityFilterConfig: AvailabilityFilterConfig
  suivi: SuiviBuckets
}

function PanelHeader({ title, count, href }: { title: string; count: number; href: string }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <h2 className="flex items-center gap-2 text-base font-semibold text-fg">
        {title}
        <span className="rounded-md bg-accent-muted px-1.5 py-0.5 text-xs font-bold tabular-nums text-accent">
          {count}
        </span>
      </h2>
      <Link href={href} className="text-xs font-medium text-accent hover:underline">
        Voir tout
      </Link>
    </div>
  )
}

export function InterimHomeDashboard({
  needs,
  availabilityRows,
  availabilityFilters,
  availabilityFilterConfig,
  suivi,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <InterimSuiviPage buckets={suivi} />
      <div className="grid gap-4 xl:grid-cols-2">
        <section className="min-w-0 rounded-xl border border-border/70 bg-white p-4 shadow-sm">
          <PanelHeader title="Besoins" count={needs.length} href="/interim/besoins" />
          <BadakanNeedList rows={needs} syncUrl={false} />
        </section>
        <section className="min-w-0 rounded-xl border border-border/70 bg-white p-4 shadow-sm">
          <PanelHeader
            title="Dispos"
            count={availabilityRows.length}
            href="/interim/disponibilites"
          />
          <InterimHomeDisponPanel
            initialRows={availabilityRows}
            serverFilters={availabilityFilters}
            filterConfig={availabilityFilterConfig}
            syncUrl={false}
          />
        </section>
      </div>
      <InterimSecondaryLinks />
    </div>
  )
}
