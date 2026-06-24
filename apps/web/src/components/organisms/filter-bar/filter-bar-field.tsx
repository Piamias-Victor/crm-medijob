import type { FilterConfig, FilterValues } from '@/lib/filters/filter-types'
import { FilterBooleanField } from '@/components/organisms/filter-bar/filter-boolean-field'
import { FilterDateRangeField } from '@/components/organisms/filter-bar/filter-date-range-field'
import { FilterMultiSelectField } from '@/components/organisms/filter-bar/filter-multi-select-field'
import { FilterNumberRangeField } from '@/components/organisms/filter-bar/filter-number-range-field'
import { FilterSelectField } from '@/components/organisms/filter-bar/filter-select-field'
import { FilterTextField } from '@/components/organisms/filter-bar/filter-text-field'

type Props<TConfigs extends readonly FilterConfig[]> = {
  config: TConfigs[number]
  values: FilterValues<TConfigs>
  onChange: (values: FilterValues<TConfigs>) => void
}

export function FilterBarField<TConfigs extends readonly FilterConfig[]>({
  config,
  values,
  onChange,
}: Props<TConfigs>) {
  const patch = <K extends keyof FilterValues<TConfigs>>(id: K, value: FilterValues<TConfigs>[K]) => {
    onChange({ ...values, [id]: value })
  }

  switch (config.type) {
    case 'select':
      return (
        <FilterSelectField
          config={config}
          value={values[config.id as keyof FilterValues<TConfigs>] as string}
          onChange={(value) => patch(config.id as keyof FilterValues<TConfigs>, value as never)}
        />
      )
    case 'multi-select':
      return (
        <FilterMultiSelectField
          config={config}
          values={values[config.id as keyof FilterValues<TConfigs>] as string[]}
          onChange={(value) => patch(config.id as keyof FilterValues<TConfigs>, value as never)}
        />
      )
    case 'text':
      return (
        <FilterTextField
          config={config}
          value={values[config.id as keyof FilterValues<TConfigs>] as string}
          onChange={(value) => patch(config.id as keyof FilterValues<TConfigs>, value as never)}
        />
      )
    case 'date-range':
      return (
        <FilterDateRangeField
          config={config}
          value={values[config.id as keyof FilterValues<TConfigs>] as { from: string; to: string }}
          onChange={(value) => patch(config.id as keyof FilterValues<TConfigs>, value as never)}
        />
      )
    case 'number-range':
      return (
        <FilterNumberRangeField
          config={config}
          value={values[config.id as keyof FilterValues<TConfigs>] as { min: string; max: string }}
          onChange={(value) => patch(config.id as keyof FilterValues<TConfigs>, value as never)}
        />
      )
    case 'boolean':
      return (
        <FilterBooleanField
          config={config}
          value={values[config.id as keyof FilterValues<TConfigs>] as boolean | null}
          onChange={(value) => patch(config.id as keyof FilterValues<TConfigs>, value as never)}
        />
      )
  }
}
