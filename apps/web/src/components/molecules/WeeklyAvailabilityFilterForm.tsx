import { FormField } from '@/components/molecules/FormField'
import { Input } from '@/components/atoms/Input'
import { Select } from '@/components/atoms/Select'
import { Button } from '@/components/atoms/Button'
import { weeklyAvailabilityFilterPath } from '@/view-models/weekly-availability-path'
import type { AvailabilityFilterFormValues } from '@/view-models/weekly-availability-filter-parse'

type JobTitleOption = { id: string; name: string }

type Props = {
  jobTitles: JobTitleOption[]
  values: AvailabilityFilterFormValues
}

export function WeeklyAvailabilityFilterForm({ jobTitles, values }: Props) {
  return (
    <form
      method="get"
      action={weeklyAvailabilityFilterPath()}
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6"
    >
      <FormField label="Date" htmlFor="date">
        <Input id="date" name="date" type="date" defaultValue={values.date} required />
      </FormField>
      <FormField label="Créneau" htmlFor="period">
        <Select id="period" name="period" defaultValue={values.period} required>
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </Select>
      </FormField>
      <FormField label="Métier" htmlFor="jobTitleId">
        <Select id="jobTitleId" name="jobTitleId" defaultValue={values.jobTitleId} required>
          <option value="">Choisir</option>
          {jobTitles.map((job) => (
            <option key={job.id} value={job.id}>
              {job.name}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField label="Ville" htmlFor="city">
        <Input id="city" name="city" defaultValue={values.city} required />
      </FormField>
      <FormField label="Rayon (km)" htmlFor="radiusKm">
        <Input
          id="radiusKm"
          name="radiusKm"
          type="number"
          min={1}
          defaultValue={values.radiusKm}
        />
      </FormField>
      <div className="flex items-end">
        <Button type="submit">Filtrer</Button>
      </div>
    </form>
  )
}
