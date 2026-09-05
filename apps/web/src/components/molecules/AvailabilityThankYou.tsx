'use client'

import { Button } from '@/components/atoms/Button'
import { monthLabel } from '@/view-models/weekly-availability-month-label'
import { MONTH_AVAILABILITY_COPY } from '@/view-models/weekly-availability-copy'

type Props = {
  savedMonth: string
  nextMonth: string
  onNextMonth: () => void
  onBack: () => void
}

export function AvailabilityThankYou({ savedMonth, nextMonth, onNextMonth, onBack }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <h2 className="text-lg font-semibold text-fg">{MONTH_AVAILABILITY_COPY.thanksTitle}</h2>
      <p className="max-w-md text-sm text-fg-muted">{MONTH_AVAILABILITY_COPY.thanksBody}</p>
      <p className="text-xs text-fg-muted">{monthLabel(savedMonth)}</p>
      <Button type="button" onClick={onNextMonth}>
        {`${MONTH_AVAILABILITY_COPY.thanksNext} · ${monthLabel(nextMonth)}`}
      </Button>
      <button type="button" onClick={onBack} className="text-sm text-fg-muted underline">
        {MONTH_AVAILABILITY_COPY.thanksBack}
      </button>
    </div>
  )
}
