'use client'

import { CheckboxGroup, type CheckboxOption } from '@/components/molecules/CheckboxGroup'

type Props = {
  options: CheckboxOption[]
  values: string[]
  onChange: (values: string[]) => void
}

export function ActivityLogFilters({ options, values, onChange }: Props) {
  return <CheckboxGroup options={options} values={values} onChange={onChange} />
}
