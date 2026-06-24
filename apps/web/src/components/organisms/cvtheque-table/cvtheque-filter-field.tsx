'use client'

import { FilterBarField } from '@/components/organisms/filter-bar/filter-bar-field'
import type { FilterConfig } from '@/lib/filters/filter-types'
import type { CvthequeFilterValues } from '@/lib/filters/cvtheque-filter-map'

type Props = {
  config: FilterConfig
  values: CvthequeFilterValues
  onChange: (values: CvthequeFilterValues) => void
}

export function CvthequeFilterField({ config, values, onChange }: Props) {
  return (
    <FilterBarField
      config={config}
      values={values}
      onChange={(next) => onChange(next as CvthequeFilterValues)}
    />
  )
}
