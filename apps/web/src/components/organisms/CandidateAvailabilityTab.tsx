'use client'

import { AvailabilityCalendar } from '@/components/molecules/AvailabilityCalendar'
import { AvailabilitySummaryBar } from '@/components/molecules/AvailabilitySummaryBar'
import { MonthAvailabilityNav } from '@/components/molecules/MonthAvailabilityNav'
import { MonthAvailabilityQuickPicks } from '@/components/molecules/MonthAvailabilityQuickPicks'
import { Button } from '@/components/atoms/Button'
import { useCandidateMonthAvailability } from '@/components/organisms/candidate-availability/use-candidate-month-availability'
import { useToastStore } from '@/stores/toast-store'
import { currentMonth } from '@/lib/paris-month'
import { countSelectedHalfDays } from '@/view-models/weekly-availability-month-grid'
import { availabilitySummary } from '@/view-models/candidate-availability-summary'
import {
  CANDIDATE_AVAILABILITY_COPY,
  MONTH_AVAILABILITY_COPY,
  WEEKLY_AVAILABILITY_COPY,
} from '@/view-models/weekly-availability-copy'
import { useState } from 'react'

type Props = { candidateId: string }

export function CandidateAvailabilityTab({ candidateId }: Props) {
  const [month, setMonth] = useState(() => currentMonth(new Date()))
  const push = useToastStore((s) => s.push)
  const planning = useCandidateMonthAvailability({
    candidateId,
    month,
    onSaveError: () => push({ variant: 'error', message: WEEKLY_AVAILABILITY_COPY.saveError }),
    onSaved: () => push({ variant: 'success', message: WEEKLY_AVAILABILITY_COPY.saved }),
  })

  return (
    <div className="flex flex-col gap-4">
      <MonthAvailabilityNav month={month} onChange={setMonth} />
      <MonthAvailabilityQuickPicks onSelect={planning.select} />
      <AvailabilitySummaryBar summary={availabilitySummary(planning.grid)} />
      <AvailabilityCalendar grid={planning.grid} onSelect={planning.select} />
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-fg-muted">{CANDIDATE_AVAILABILITY_COPY.legend}</p>
        <Button type="button" disabled={planning.isSaving} onClick={planning.submit}>
          {planning.isSaving ? MONTH_AVAILABILITY_COPY.saving : MONTH_AVAILABILITY_COPY.save}
          {` · ${countSelectedHalfDays(planning.grid)}`}
        </Button>
      </div>
    </div>
  )
}
