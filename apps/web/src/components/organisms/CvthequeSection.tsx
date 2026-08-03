'use client'

import { Suspense, useState } from 'react'
import { EntityViewShell } from '@/components/molecules/EntityViewShell'
import { CvthequeKanban } from '@/components/organisms/CvthequeKanban'
import { CvthequeTable } from '@/components/organisms/cvtheque-table/cvtheque-table'
import { CandidateMapView } from '@/components/organisms/CandidateMapView'
import { CvthequeTableSkeleton } from '@/components/molecules/skeletons/CvthequeTableSkeleton'
import type { CvthequeView } from '@/components/molecules/ViewToggle'
import { cvthequeViewOptions } from '@/components/molecules/ViewToggle'
import type { EntityTableSortState } from '@/components/organisms/entity-table/entity-table-types'
import { useCvthequeListQuery } from '@/lib/hooks/use-cvtheque-list-query'
import type { CandidateListFilters } from '@/view-models/candidate-list-filters.schema'
import type { CvthequeFilterConfig } from '@/lib/filters/cvtheque-filter-config'
import type { RawCandidate, RawStage } from '@/view-models/candidate-kanban.types'

type Props = {
  initialList: { rows: RawCandidate[]; stages: RawStage[] }
  serverFilters: CandidateListFilters
  filterConfig: CvthequeFilterConfig
  onCountChange?: (count: number) => void
}

export function CvthequeSection({ initialList, serverFilters, filterConfig, onCountChange }: Props) {
  const [view, setView] = useState<CvthequeView>('table')
  const [sort, setSort] = useState<EntityTableSortState | null>(null)
  const { values, setFilters, reset, candidates, stages, tableRows, apiFilters } = useCvthequeListQuery(
    initialList,
    serverFilters,
    filterConfig,
    onCountChange,
  )

  return (
    <EntityViewShell
      view={view}
      onViewChange={setView}
      viewOptions={cvthequeViewOptions}
      panels={{
        table: {
          title: 'CVthèque',
          description: 'Parcourez tous les profils de la CVthèque.',
          content: (
            <Suspense fallback={<CvthequeTableSkeleton />}>
              <CvthequeTable
                filterConfig={filterConfig}
                values={values}
                onChange={setFilters}
                onReset={reset}
                rows={tableRows}
                exportFilters={apiFilters}
                sort={sort}
                onSortChange={setSort}
              />
            </Suspense>
          ),
        },
        kanban: {
          title: 'CVthèque',
          description: 'Suivez la progression par mission et étape de pipeline.',
          content: <CvthequeKanban candidates={candidates} stages={stages} />,
        },
        map: {
          title: 'Carte candidats',
          description: 'Localisez les profils géocodés selon les filtres actifs.',
          content: <CandidateMapView candidates={candidates} />,
        },
      }}
    />
  )
}
