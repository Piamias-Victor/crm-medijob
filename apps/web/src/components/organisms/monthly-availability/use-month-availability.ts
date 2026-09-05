'use client'

import { useEffect, useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import { adjacentMonth } from '@/lib/paris-month'
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

export function useMonthAvailability(input: {
  token: string
  initialMonth: string
  initialSlots: AvailabilitySlotInput[]
  onSaveError: () => void
}) {
  const [month, setMonth] = useState(input.initialMonth)
  const [savedMonth, setSavedMonth] = useState<string | null>(null)
  const [grid, setGrid] = useState(() => buildGrid(input.initialMonth, input.initialSlots))

  const query = trpc.weeklyAvailability.getMonth.useQuery(
    { token: input.token, month },
    {
      refetchOnWindowFocus: false,
      initialData:
        month === input.initialMonth
          ? { month: input.initialMonth, slots: input.initialSlots }
          : undefined,
    },
  )

  useEffect(() => {
    if (query.data) setGrid(buildGrid(query.data.month, query.data.slots))
  }, [query.data])

  const save = trpc.weeklyAvailability.saveMonth.useMutation({
    onSuccess: (data) => setSavedMonth(data.month),
    onError: input.onSaveError,
  })

  const goToMonth = (next: string) => {
    setSavedMonth(null)
    setMonth(next)
  }

  return {
    month,
    grid,
    savedMonth,
    isSaving: save.isPending,
    isLoading: query.isPending,
    select: (target: MonthSelectionTarget) => setGrid(toggleMonthSelection(grid, target)),
    goToMonth,
    goToNextMonth: () => goToMonth(adjacentMonth(month, 1)),
    dismissThanks: () => setSavedMonth(null),
    submit: () =>
      save.mutate({ token: input.token, month, slots: selectedMonthSlots(grid) }),
  }
}
