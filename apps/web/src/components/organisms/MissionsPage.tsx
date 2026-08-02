'use client'

import { useCallback, useMemo, useState } from 'react'
import { Briefcase, Plus } from 'lucide-react'
import { toMissionListRows } from '@/view-models/mission-list'
import { useMissionListQuery } from '@/lib/hooks/use-mission-list-query'
import { Button } from '@/components/atoms/Button'
import { DashboardPage } from '@/components/molecules/DashboardPage'
import { EntityViewShell } from '@/components/molecules/EntityViewShell'
import { MissionFilterBar } from '@/components/organisms/mission-table/mission-filter-bar'
import { MissionsPageCreate } from '@/components/organisms/missions-page-create'
import { buildMissionViewPanels } from '@/components/organisms/missions-page-panels'
import type { EntityTableSortState } from '@/components/organisms/entity-table/entity-table-types'
import { missionViewOptions, type MissionView } from '@/components/molecules/ViewToggle'
import type { MissionFilterConfig } from '@/lib/filters/mission-filter-config'
import type { MissionListFilters } from '@/view-models/mission-list-filters.schema'
import type { RawMission } from '@/view-models/mission-kanban.types'

type Ref = { id: string; name: string }

type Props = {
  initialRows: RawMission[]
  serverFilters: MissionListFilters
  filterConfig: MissionFilterConfig
  pharmacies: Ref[]
  jobTitles: Ref[]
  recruiters: Ref[]
}

export function MissionsPage({
  initialRows,
  serverFilters,
  filterConfig,
  pharmacies,
  jobTitles,
  recruiters,
}: Props) {
  const [view, setView] = useState<MissionView>('list')
  const [open, setOpen] = useState(false)
  const [sort, setSort] = useState<EntityTableSortState | null>(null)
  const [count, setCount] = useState(initialRows.length)
  const onCountChange = useCallback((next: number) => setCount(next), [])
  const { values, setFilters, reset, rows } = useMissionListQuery(
    initialRows,
    serverFilters,
    filterConfig,
    onCountChange,
  )
  const listRows = useMemo(() => toMissionListRows(rows), [rows])
  const panels = useMemo(
    () => buildMissionViewPanels({ listRows, rows, sort, onSortChange: setSort }),
    [listRows, rows, sort],
  )

  return (
    <DashboardPage
      icon={<Briefcase className="size-5" />}
      title="Missions"
      description={`${count} mission(s) — tableau, kanban ou carte.`}
      actions={
        <Button variant="accent" className="shadow-md shadow-accent/20" onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          Nouvelle mission
        </Button>
      }
    >
      <div className="space-y-4">
        <MissionFilterBar
          filterConfig={filterConfig}
          values={values}
          onChange={setFilters}
          onReset={reset}
        />
        <EntityViewShell
          view={view}
          onViewChange={setView}
          viewOptions={missionViewOptions}
          panels={panels}
        />
      </div>
      <MissionsPageCreate
        open={open}
        onOpenChange={setOpen}
        pharmacies={pharmacies}
        jobTitles={jobTitles}
        recruiters={recruiters}
      />
    </DashboardPage>
  )
}
