'use client'

import { DatePicker } from '@/components/molecules/DatePicker'
import { CLEAR_DATE_LABEL, SELECT_DATE_LABEL } from '@/lib/date-picker-utils'
import type { DateRangeValue, DateRangeFilterConfig } from '@/lib/filters/filter-types'

type Props = {
  config: DateRangeFilterConfig
  value: DateRangeValue
  onChange: (value: DateRangeValue) => void
}

export function FilterDateRangeField({ config, value, onChange }: Props) {
  return (
    <fieldset className="min-w-0 rounded-md border border-border bg-white p-3">
      <legend className="px-1 text-xs font-semibold text-fg">{config.label}</legend>
      <div className="flex flex-col gap-2">
        <div className="min-w-0 space-y-1">
          <span className="text-[10px] font-medium uppercase tracking-wide text-fg-muted">Du</span>
          <DatePicker
            value={value.from || undefined}
            emptyLabel={SELECT_DATE_LABEL}
            clearLabel={CLEAR_DATE_LABEL}
            ariaLabel={`${config.label} — début`}
            onChange={(from) => onChange({ ...value, from: from ?? '' })}
          />
        </div>
        <div className="min-w-0 space-y-1">
          <span className="text-[10px] font-medium uppercase tracking-wide text-fg-muted">Au</span>
          <DatePicker
            value={value.to || undefined}
            emptyLabel={SELECT_DATE_LABEL}
            clearLabel={CLEAR_DATE_LABEL}
            ariaLabel={`${config.label} — fin`}
            onChange={(to) => onChange({ ...value, to: to ?? '' })}
          />
        </div>
      </div>
    </fieldset>
  )
}
