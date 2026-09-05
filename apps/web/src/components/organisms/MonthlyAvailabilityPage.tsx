'use client'

import { ToastViewport } from '@/components/molecules/ToastViewport'
import { AvailabilityThankYou } from '@/components/molecules/AvailabilityThankYou'
import { MonthAvailabilityList } from '@/components/molecules/MonthAvailabilityList'
import { MonthAvailabilityNav } from '@/components/molecules/MonthAvailabilityNav'
import { MonthAvailabilityQuickPicks } from '@/components/molecules/MonthAvailabilityQuickPicks'
import { MonthAvailabilitySaveBar } from '@/components/molecules/MonthAvailabilitySaveBar'
import { useMonthAvailability } from '@/components/organisms/monthly-availability/use-month-availability'
import { adjacentMonth } from '@/lib/paris-month'
import { useToastStore } from '@/stores/toast-store'
import { countSelectedHalfDays } from '@/view-models/weekly-availability-month-grid'
import {
  MONTH_AVAILABILITY_COPY,
  WEEKLY_AVAILABILITY_COPY,
} from '@/view-models/weekly-availability-copy'
import type { AvailabilitySlotInput } from '@/view-models/weekly-availability.schema'

type Props = { token: string; month: string; slots: AvailabilitySlotInput[] }

export function MonthlyAvailabilityPage({ token, month, slots }: Props) {
  const push = useToastStore((s) => s.push)
  const planning = useMonthAvailability({
    token,
    initialMonth: month,
    initialSlots: slots,
    onSaveError: () => push({ variant: 'error', message: WEEKLY_AVAILABILITY_COPY.saveError }),
  })

  if (planning.savedMonth) {
    return (
      <main className="min-h-dvh bg-surface px-4 py-10">
        <AvailabilityThankYou
          savedMonth={planning.savedMonth}
          nextMonth={adjacentMonth(planning.savedMonth, 1)}
          onNextMonth={planning.goToNextMonth}
          onBack={planning.dismissThanks}
        />
        <ToastViewport />
      </main>
    )
  }

  return (
    <main className="min-h-dvh bg-surface pb-24">
      <header className="sticky top-0 z-10 border-b border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl flex-col gap-3 px-4 py-3">
          <div>
            <p className="text-xs font-semibold tracking-wide text-fg-muted uppercase">
              {MONTH_AVAILABILITY_COPY.brand}
            </p>
            <h1 className="text-lg font-semibold text-fg">{MONTH_AVAILABILITY_COPY.title}</h1>
          </div>
          <MonthAvailabilityNav month={planning.month} onChange={planning.goToMonth} />
        </div>
      </header>
      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-4">
        <p className="text-sm text-fg-muted">{MONTH_AVAILABILITY_COPY.intro}</p>
        <MonthAvailabilityQuickPicks onSelect={planning.select} />
        <MonthAvailabilityList grid={planning.grid} onSelect={planning.select} />
        <p className="text-xs text-fg-muted">{MONTH_AVAILABILITY_COPY.emptyHint}</p>
      </div>
      <MonthAvailabilitySaveBar
        count={countSelectedHalfDays(planning.grid)}
        saving={planning.isSaving}
        onSave={planning.submit}
      />
      <ToastViewport />
    </main>
  )
}
