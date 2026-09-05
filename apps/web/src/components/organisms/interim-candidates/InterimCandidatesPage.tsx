'use client'

import { useMemo, useState } from 'react'
import { SectionCard } from '@/components/molecules/SectionCard'
import { CvthequeTable } from '@/components/organisms/cvtheque-table/cvtheque-table'
import { interimCandidateColumns } from '@/components/organisms/interim-candidates/interim-candidate-columns'
import type { EntityTableSortState } from '@/components/organisms/entity-table/entity-table-types'
import { useCvthequeListQuery } from '@/lib/hooks/use-cvtheque-list-query'
import { interimCountLabel } from '@/view-models/interim-count-label'
import type { CvthequeFilterConfig } from '@/lib/filters/cvtheque-filter-config'
import type { CandidateListFilters } from '@/view-models/candidate-list-filters.schema'
import type { RawCandidate, RawStage } from '@/view-models/candidate-kanban.types'
import type { DeclaredAvailabilityRow } from '@/view-models/weekly-availability-declared-row'

type Props = {
  initialList: { rows: RawCandidate[]; stages: RawStage[] }
  serverFilters: CandidateListFilters
  filterConfig: CvthequeFilterConfig
  declared: DeclaredAvailabilityRow[]
}

export function InterimCandidatesPage({
  initialList,
  serverFilters,
  filterConfig,
  declared,
}: Props) {
  const [sort, setSort] = useState<EntityTableSortState | null>(null)
  const [count, setCount] = useState(initialList.rows.length)
  const { values, setFilters, reset, tableRows, apiFilters } = useCvthequeListQuery(
    initialList,
    serverFilters,
    filterConfig,
    setCount,
  )
  const columns = useMemo(
    () => interimCandidateColumns(new Map(declared.map((row) => [row.id, row.halfDayLabel]))),
    [declared],
  )

  return (
    <SectionCard
      title="Candidats"
      description={`${interimCountLabel(count, 'candidat')} · ${interimCountLabel(declared.length, 'candidat')} avec des créneaux déclarés.`}
    >
      <CvthequeTable
        filterConfig={filterConfig}
        values={values}
        onChange={setFilters}
        onReset={reset}
        rows={tableRows}
        exportFilters={apiFilters}
        sort={sort}
        onSortChange={setSort}
        columns={columns}
      />
    </SectionCard>
  )
}
