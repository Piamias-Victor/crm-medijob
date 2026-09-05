'use client'

import { Button } from '@/components/atoms/Button'
import { halfDayCountLabel } from '@/view-models/weekly-availability-count'
import { MONTH_AVAILABILITY_COPY } from '@/view-models/weekly-availability-copy'

type Props = {
  count: number
  saving: boolean
  onSave: () => void
}

export function MonthAvailabilitySaveBar({ count, saving, onSave }: Props) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <p className="text-sm font-medium text-fg-muted">{halfDayCountLabel(count)}</p>
        <Button type="button" className="ml-auto min-h-11 px-6" disabled={saving} onClick={onSave}>
          {saving ? MONTH_AVAILABILITY_COPY.saving : MONTH_AVAILABILITY_COPY.save}
        </Button>
      </div>
    </div>
  )
}
