'use client'

import { FormField } from '@/components/molecules/FormField'
import { Combobox } from '@/components/molecules/Combobox'
import { ACTIVITY_TYPE_OPTIONS } from '@/view-models/activity-log.labels'

const FILTER_OPTIONS = [{ value: 'ALL', label: 'Tous les types' }, ...ACTIVITY_TYPE_OPTIONS]

type Props = {
  value: string
  onChange: (value: string) => void
}

export function ActivityTypeFilter({ value, onChange }: Props) {
  return (
    <FormField label="Filtrer par type">
      <Combobox
        value={value}
        onChange={onChange}
        options={FILTER_OPTIONS}
        placeholder="Tous les types"
      />
    </FormField>
  )
}
