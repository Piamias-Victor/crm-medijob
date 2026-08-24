import { Suspense } from 'react'
import { FacturationLinesPage } from '@/components/organisms/FacturationLinesPage'
import { EntityListPageSkeleton } from '@/components/molecules/skeletons/EntityListPageSkeleton'
import { loadFacturationLinesPage } from '@/lib/finance/load-facturation-lines-page'

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function Page({ searchParams }: Props) {
  const loaded = await loadFacturationLinesPage('PLACEMENT', await searchParams)
  return (
    <Suspense fallback={<EntityListPageSkeleton />}>
      <FacturationLinesPage
        kind="PLACEMENT"
        createLabel="Nouveau Placement"
        createTitle="Nouveau Placement"
        csvFilename="placements"
        initialRows={loaded.rows}
        serverFilters={loaded.serverFilters}
        filterConfig={loaded.filterConfig}
        pharmacies={loaded.refs.pharmacies}
        candidates={loaded.refs.candidates}
        missions={loaded.refs.missions}
        recruiters={loaded.refs.recruiters}
      />
    </Suspense>
  )
}
