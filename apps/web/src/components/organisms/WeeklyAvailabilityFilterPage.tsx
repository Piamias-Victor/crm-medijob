import { WeeklyAvailabilityFilterForm } from '@/components/molecules/WeeklyAvailabilityFilterForm'
import { WeeklyAvailabilityFilterList } from '@/components/organisms/WeeklyAvailabilityFilterList'
import type { AvailabilityFilterFormValues } from '@/view-models/weekly-availability-filter-parse'
import type { AvailabilityFilterRow } from '@/view-models/weekly-availability-filter-row'

type Props = {
  jobTitles: { id: string; name: string }[]
  values: AvailabilityFilterFormValues
  rows: AvailabilityFilterRow[]
  queried: boolean
}

export function WeeklyAvailabilityFilterPage({ jobTitles, values, rows, queried }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <WeeklyAvailabilityFilterForm jobTitles={jobTitles} values={values} />
      <WeeklyAvailabilityFilterList rows={rows} queried={queried} />
    </div>
  )
}
