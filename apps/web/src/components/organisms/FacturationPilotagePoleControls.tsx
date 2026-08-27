'use client'

import { Combobox } from '@/components/molecules/Combobox'
import { PillTabs } from '@/components/molecules/PillTabs'
import {
  PILOTAGE_POLE_MONTH,
  PILOTAGE_POLE_PERIOD_TABS,
  PILOTAGE_POLE_TITLE,
  poleMonthOptions,
} from '@/view-models/facturation-pilotage-poles-copy'
import type { PolePeriod } from '@/view-models/facturation-pilotage-pole-progress'

type Props = {
  period: PolePeriod
  month: string
  months: string[]
  onPeriod: (period: PolePeriod) => void
  onMonth: (month: string) => void
}

export function FacturationPilotagePoleControls({
  period,
  month,
  months,
  onPeriod,
  onMonth,
}: Props) {
  const options = poleMonthOptions(months)
  return (
    <div className="flex flex-wrap items-center gap-2">
      <PillTabs
        aria-label={PILOTAGE_POLE_TITLE}
        active={period}
        onChange={(id) => onPeriod(id === 'year' ? 'year' : 'month')}
        items={[...PILOTAGE_POLE_PERIOD_TABS]}
      />
      {period === 'month' && options.length > 0 ? (
        <div className="w-56">
          <Combobox
            value={month}
            onChange={onMonth}
            options={options}
            placeholder={PILOTAGE_POLE_MONTH}
          />
        </div>
      ) : null}
    </div>
  )
}
