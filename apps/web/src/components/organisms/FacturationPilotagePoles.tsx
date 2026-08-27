'use client'

import { useEffect, useState } from 'react'
import { SectionCard } from '@/components/molecules/SectionCard'
import { PilotagePoleCard } from '@/components/molecules/PilotagePoleCard'
import { FacturationPilotagePoleControls } from '@/components/organisms/FacturationPilotagePoleControls'
import {
  defaultPoleMonth,
  poleProgress,
  type PolePeriod,
} from '@/view-models/facturation-pilotage-pole-progress'
import {
  PILOTAGE_POLE_INTERIM,
  PILOTAGE_POLE_PLACEMENT,
  PILOTAGE_POLE_TITLE,
  polePeriodCaption,
} from '@/view-models/facturation-pilotage-poles-copy'
import type { PilotagePoles } from '@/view-models/facturation-pilotage-poles'

type Props = { poles: PilotagePoles }

export function FacturationPilotagePoles({ poles }: Props) {
  const months = poles.placement.months.map((row) => row.month)
  const monthsKey = months.join(',')
  const [period, setPeriod] = useState<PolePeriod>('month')
  const [month, setMonth] = useState(() => defaultPoleMonth(months))
  useEffect(() => {
    const keys = monthsKey ? monthsKey.split(',') : []
    if (keys.length > 0 && !keys.includes(month)) setMonth(defaultPoleMonth(keys))
  }, [month, monthsKey])
  const caption = polePeriodCaption(period, month)
  const placement = poleProgress(
    poles.placement,
    poles.monthly.caPlacement,
    poles.monthly.margePlacement,
    period,
    month,
  )
  const interim = poleProgress(
    poles.interim,
    poles.monthly.caInterim,
    poles.monthly.margeInterim,
    period,
    month,
  )
  return (
    <SectionCard variant="glass" title={PILOTAGE_POLE_TITLE} bodyClassName="space-y-4 p-4 sm:p-5">
      <FacturationPilotagePoleControls
        period={period}
        month={month}
        months={months}
        onPeriod={setPeriod}
        onMonth={setMonth}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <PilotagePoleCard title={PILOTAGE_POLE_PLACEMENT} caption={caption} progress={placement} />
        <PilotagePoleCard title={PILOTAGE_POLE_INTERIM} caption={caption} progress={interim} />
      </div>
    </SectionCard>
  )
}
