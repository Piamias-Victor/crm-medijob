'use client'

import { EntityListFilterBar } from '@/components/organisms/entity-list-filter-bar/entity-list-filter-bar'
import type { ContactFilterConfig } from '@/lib/filters/contact-filter-config'
import type { ContactFilterValues } from '@/lib/filters/contact-filter-map'

type Props = {
  filterConfig: ContactFilterConfig
  values: ContactFilterValues
  onChange: (values: ContactFilterValues) => void
  onReset: () => void
}

export function ContactFilterBar({ filterConfig, values, onChange, onReset }: Props) {
  return (
    <EntityListFilterBar
      primary={[...filterConfig]}
      advanced={[]}
      values={values}
      onChange={onChange}
      onReset={onReset}
      advancedCount={0}
    />
  )
}
