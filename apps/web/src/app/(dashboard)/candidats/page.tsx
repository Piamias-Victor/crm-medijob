import { Suspense } from 'react'
import { createServerCaller } from '@/lib/trpc/server'
import { CandidatsPage } from '@/components/organisms/CandidatsPage'
import { parseCandidatsTab } from '@/view-models/candidats-tab'
import { buildCvthequeFilterConfig } from '@/lib/filters/cvtheque-filter-config'
import {
  buildCvthequeFilterDefaults,
  normalizeCvthequeFilterValues,
  toCandidateListFilters,
} from '@/lib/filters/cvtheque-filter-map'
import { deserializeFilters } from '@/lib/filters/serialize'
import { toUrlSearchParams } from '@/lib/url-search-params'

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function Page({ searchParams }: Props) {
  const params = await searchParams
  const { tab } = params
  const caller = await createServerCaller()
  const referentials = await caller.candidate.referentials()
  const filterConfig = buildCvthequeFilterConfig(referentials)
  const defaults = buildCvthequeFilterDefaults(filterConfig)
  const listFilters = toCandidateListFilters(
    normalizeCvthequeFilterValues(
      deserializeFilters(filterConfig, toUrlSearchParams(params)),
      defaults,
    ),
  )
  const [list, inbox] = await Promise.all([
    caller.candidate.list(listFilters),
    caller.application.listInbox(),
  ])

  return (
    <Suspense fallback={<p className="p-6 text-sm text-fg-muted">Chargement…</p>}>
      <CandidatsPage
        list={list}
        inbox={inbox}
        serverFilters={listFilters}
        filterConfig={filterConfig}
        initialTab={parseCandidatsTab(typeof tab === 'string' ? tab : undefined)}
      />
    </Suspense>
  )
}
