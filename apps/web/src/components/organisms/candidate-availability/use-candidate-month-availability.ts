'use client'

import { useEffect, useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import {
  selectedMonthSlots,
  toMonthGrid,
  type MonthGrid,
} from '@/view-models/weekly-availability-month-grid'
import { toggleMonthSelection } from '@/view-models/weekly-availability-month-toggle'
import type { MonthSelectionTarget } from '@/view-models/weekly-availability-month-toggle'
import type { AvailabilitySlotInput } from '@/view-models/weekly-availability.schema'

const buildGrid = (month: string, slots: AvailabilitySlotInput[]): MonthGrid =>
  toMonthGrid({ month, slots, now: new Date() })

export function useCandidateMonthAvailability(input: {
  candidateId: string
  month: string
  onSaveError: () => void
  onSaved: () => void
}) {
  const [grid, setGrid] = useState<MonthGrid>(() => buildGrid(input.month, []))
  const query = trpc.weeklyAvailability.candidateMonth.useQuery({
    candidateId: input.candidateId,
    month: input.month,
  })

  useEffect(() => {
    if (query.data) setGrid(buildGrid(query.data.month, query.data.slots))
  }, [query.data])

  const save = trpc.weeklyAvailability.saveCandidateMonth.useMutation({
    onSuccess: (data) => {
      setGrid(buildGrid(data.month, data.slots))
      input.onSaved()
    },
    onError: input.onSaveError,
  })

  return {
    grid,
    isLoading: query.isPending,
    isSaving: save.isPending,
    select: (target: MonthSelectionTarget) => setGrid(toggleMonthSelection(grid, target)),
    submit: () =>
      save.mutate({
        candidateId: input.candidateId,
        month: input.month,
        slots: selectedMonthSlots(grid),
      }),
  }
}
