'use client'

import type { CSSProperties, RefObject } from 'react'
import { FilterBarField } from '@/components/organisms/filter-bar/filter-bar-field'
import type { FilterConfig, FilterValues } from '@/lib/filters/filter-types'

type Props<TValues extends FilterValues<readonly FilterConfig[]>> = {
  advanced: FilterConfig[]
  values: TValues
  onChange: (values: TValues) => void
  panelRef: RefObject<HTMLDivElement | null>
  style: CSSProperties
}

export function EntityListAdvancedFiltersPanel<TValues extends FilterValues<readonly FilterConfig[]>>({
  advanced,
  values,
  onChange,
  panelRef,
  style,
}: Props<TValues>) {
  return (
    <div
      ref={panelRef}
      style={style}
      className="rounded-lg border border-border bg-surface p-3 shadow-lg"
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {advanced.map((item) => (
          <FilterBarField
            key={item.id}
            config={item}
            values={values}
            onChange={(next) => onChange(next as TValues)}
          />
        ))}
      </div>
    </div>
  )
}
