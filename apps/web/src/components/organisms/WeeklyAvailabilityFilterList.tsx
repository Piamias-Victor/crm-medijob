'use client'

import { CalendarClock } from 'lucide-react'
import { EntityGridList } from '@/components/organisms/EntityGridList'
import { WeeklyAvailabilityFilterCard } from '@/components/molecules/WeeklyAvailabilityFilterCard'
import type { AvailabilityFilterRow } from '@/view-models/weekly-availability-filter-row'

type Props = {
  rows: AvailabilityFilterRow[]
  queried: boolean
}

export function WeeklyAvailabilityFilterList({ rows, queried }: Props) {
  return (
    <EntityGridList
      items={rows}
      getKey={(row) => row.id}
      renderItem={(row) => <WeeklyAvailabilityFilterCard row={row} />}
      emptyIcon={CalendarClock}
      emptyTitle={queried ? 'Aucun candidat dispo' : 'Filtrer les dispos'}
      emptyDescription={
        queried
          ? 'Aucun origin App avec ce créneau, métier et rayon.'
          : 'Renseigner créneau AM/PM, métier et ville.'
      }
    />
  )
}
