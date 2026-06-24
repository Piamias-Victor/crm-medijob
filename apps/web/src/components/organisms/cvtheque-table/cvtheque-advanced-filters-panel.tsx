'use client'

import type { CSSProperties, RefObject } from 'react'
import { CvthequeFilterField } from '@/components/organisms/cvtheque-table/cvtheque-filter-field'
import type { CvthequeFilterConfig } from '@/lib/filters/cvtheque-filter-config'
import type { CvthequeFilterValues } from '@/lib/filters/cvtheque-filter-map'

type Props = {
  advanced: CvthequeFilterConfig[number][]
  values: CvthequeFilterValues
  onChange: (values: CvthequeFilterValues) => void
  panelRef: RefObject<HTMLDivElement | null>
  style: CSSProperties
}

export function CvthequeAdvancedFiltersPanel({ advanced, values, onChange, panelRef, style }: Props) {
  return (
    <div
      ref={panelRef}
      style={style}
      className="rounded-lg border border-border bg-surface p-3 shadow-lg"
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {advanced.map((item) => (
          <CvthequeFilterField key={item.id} config={item} values={values} onChange={onChange} />
        ))}
      </div>
    </div>
  )
}
