'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { Card } from '@/components/atoms/Card'
import { ToastViewport } from '@/components/molecules/ToastViewport'
import { WeeklyAvailabilityGrid } from '@/components/molecules/WeeklyAvailabilityGrid'
import { WeeklyAvailabilityWeekNav } from '@/components/molecules/WeeklyAvailabilityWeekNav'
import { trpc } from '@/lib/trpc/client'
import { useToastStore } from '@/stores/toast-store'
import { toWeekGrid } from '@/view-models/weekly-availability-grid'
import { WEEKLY_AVAILABILITY_COPY } from '@/view-models/weekly-availability-copy'
import { slotsFromDays } from '@/view-models/weekly-availability-slots'
import { toggleGridDay } from '@/view-models/weekly-availability-toggle'
import type { AvailabilitySlotInput } from '@/view-models/weekly-availability.schema'

type Props = { token: string; weekStart: string; slots: AvailabilitySlotInput[] }

export function WeeklyAvailabilityPage({ token, weekStart, slots }: Props) {
  const push = useToastStore((s) => s.push)
  const save = trpc.weeklyAvailability.saveWeek.useMutation({
    onSuccess: () => push({ variant: 'success', message: WEEKLY_AVAILABILITY_COPY.saved }),
    onError: () => push({ variant: 'error', message: WEEKLY_AVAILABILITY_COPY.saveError }),
  })
  const initial = useMemo(
    () => toWeekGrid({ weekStart, slots, now: new Date() }).days,
    [weekStart, slots],
  )
  const [days, setDays] = useState(initial)

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Card className="flex flex-col gap-6 p-6">
        <h1 className="text-xl font-semibold text-fg">{WEEKLY_AVAILABILITY_COPY.title}</h1>
        <WeeklyAvailabilityWeekNav token={token} weekStart={weekStart} />
        <WeeklyAvailabilityGrid
          days={days}
          onToggle={(date, period) => setDays(toggleGridDay(days, date, period))}
        />
        <p className="text-sm text-fg-muted">{WEEKLY_AVAILABILITY_COPY.emptyHint}</p>
        <Button
          type="button"
          disabled={save.isPending}
          onClick={() => save.mutate({ token, weekStart, slots: slotsFromDays(days) })}
        >
          {WEEKLY_AVAILABILITY_COPY.save}
        </Button>
      </Card>
      <ToastViewport />
    </main>
  )
}
