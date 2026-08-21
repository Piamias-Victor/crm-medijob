'use client'

import { DatePicker } from '@/components/molecules/DatePicker'
import { CLEAR_DATE_LABEL, SELECT_DATE_LABEL } from '@/lib/date-picker-utils'
import type { DateRangeValue } from '@/lib/filters/filter-types'
import type { DateRangeFilterConfig } from '@/lib/filters/filter-types'

type Props = {
  config: DateRangeFilterConfig
  value: DateRangeValue
  onChange: (value: DateRangeValue) => void
}

export function FilterDateRangeField({ config, value, onChange }: Props) {
  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-fg-muted">{config.label}</span>
      <div className="flex min-w-72 gap-2">
        <DatePicker
          value={value.from}
          emptyLabel={SELECT_DATE_LABEL}
          clearLabel={CLEAR_DATE_LABEL}
          ariaLabel={`${config.label} — début`}
          onChange={(from) => onChange({ ...value, from: from ?? '' })}
        />
        <DatePicker
          value={value.to}
          emptyLabel={SELECT_DATE_LABEL}
          clearLabel={CLEAR_DATE_LABEL}
          ariaLabel={`${config.label} — fin`}
          onChange={(to) => onChange({ ...value, to: to ?? '' })}
        />
      </div>
    </div>
  )
}
