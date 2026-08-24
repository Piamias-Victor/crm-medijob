'use client'

import { useState } from 'react'
import { Select } from '@/components/atoms/Select'
import { SectionCard } from '@/components/molecules/SectionCard'
import { PillTabs } from '@/components/molecules/PillTabs'
import { PilotagePoleCard } from '@/components/molecules/PilotagePoleCard'
import {
  defaultPoleMonth,
  poleProgress,
  type PolePeriod,
} from '@/view-models/facturation-pilotage-pole-progress'
import {
  PILOTAGE_POLE_INTERIM,
  PILOTAGE_POLE_PERIOD_TABS,
  PILOTAGE_POLE_PLACEMENT,
  PILOTAGE_POLE_TITLE,
  poleMonthOptions,
} from '@/view-models/facturation-pilotage-poles-copy'
import type { PilotagePoles } from '@/view-models/facturation-pilotage-poles'

type Props = { poles: PilotagePoles }

export function FacturationPilotagePoles({ poles }: Props) {
  const months = poles.placement.months.map((row) => row.month)
  const [period, setPeriod] = useState<PolePeriod>('month')
  const [month, setMonth] = useState(() => defaultPoleMonth(months))
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
    <SectionCard
      variant="glass"
      title={PILOTAGE_POLE_TITLE}
      bodyClassName="space-y-4 p-4 sm:p-5"
      actions={
        <PoleControls
          period={period}
          month={month}
          months={months}
          onPeriod={setPeriod}
          onMonth={setMonth}
        />
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <PilotagePoleCard title={PILOTAGE_POLE_PLACEMENT} progress={placement} />
        <PilotagePoleCard title={PILOTAGE_POLE_INTERIM} progress={interim} />
      </div>
    </SectionCard>
  )
}

type Controls = {
  period: PolePeriod
  month: string
  months: string[]
  onPeriod: (period: PolePeriod) => void
  onMonth: (month: string) => void
}

function PoleControls({ period, month, months, onPeriod, onMonth }: Controls) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <PillTabs
        aria-label={PILOTAGE_POLE_TITLE}
        active={period}
        onChange={(id) => onPeriod(id === 'year' ? 'year' : 'month')}
        items={[...PILOTAGE_POLE_PERIOD_TABS]}
      />
      {period === 'month' && months.length > 0 ? (
        <Select value={month} onChange={(event) => onMonth(event.target.value)} className="w-auto">
          {poleMonthOptions(months).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : null}
    </div>
  )
}
