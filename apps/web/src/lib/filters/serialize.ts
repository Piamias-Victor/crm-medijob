import { buildDefaultFilterValues, type FilterConfig, type FilterValues } from '@/lib/filters/filter-types'

function isEmptyValue(config: FilterConfig, value: unknown): boolean {
  switch (config.type) {
    case 'select':
    case 'text':
      return value === ''
    case 'multi-select':
      return !Array.isArray(value) || value.length === 0
    case 'date-range':
      return (
        typeof value !== 'object' ||
        value === null ||
        (!('from' in value && value.from) && !('to' in value && value.to))
      )
    case 'number-range':
      return (
        typeof value !== 'object' ||
        value === null ||
        (!('min' in value && value.min) && !('max' in value && value.max))
      )
    case 'boolean':
      return value === null
  }
}

export function serializeFilters<TConfigs extends readonly FilterConfig[]>(
  config: TConfigs,
  values: FilterValues<TConfigs>,
): URLSearchParams {
  const params = new URLSearchParams()
  for (const item of config) {
    const value = values[item.id as keyof FilterValues<TConfigs>]
    if (isEmptyValue(item, value)) continue

    switch (item.type) {
      case 'select':
      case 'text':
        params.set(item.id, String(value))
        break
      case 'multi-select':
        for (const entry of value as string[]) params.append(item.id, entry)
        break
      case 'date-range': {
        const range = value as { from: string; to: string }
        if (range.from) params.set(`${item.id}.from`, range.from)
        if (range.to) params.set(`${item.id}.to`, range.to)
        break
      }
      case 'number-range': {
        const range = value as { min: string; max: string }
        if (range.min) params.set(`${item.id}.min`, range.min)
        if (range.max) params.set(`${item.id}.max`, range.max)
        break
      }
      case 'boolean':
        params.set(item.id, String(value))
        break
    }
  }
  return params
}

export function deserializeFilters<TConfigs extends readonly FilterConfig[]>(
  config: TConfigs,
  params: URLSearchParams,
): FilterValues<TConfigs> {
  const values = buildDefaultFilterValues(config)
  for (const item of config) {
    switch (item.type) {
      case 'select':
      case 'text':
        if (params.has(item.id)) values[item.id as keyof FilterValues<TConfigs>] = params.get(item.id)! as never
        break
      case 'multi-select':
        values[item.id as keyof FilterValues<TConfigs>] = params.getAll(item.id) as never
        break
      case 'date-range':
        values[item.id as keyof FilterValues<TConfigs>] = {
          from: params.get(`${item.id}.from`) ?? '',
          to: params.get(`${item.id}.to`) ?? '',
        } as never
        break
      case 'number-range':
        values[item.id as keyof FilterValues<TConfigs>] = {
          min: params.get(`${item.id}.min`) ?? '',
          max: params.get(`${item.id}.max`) ?? '',
        } as never
        break
      case 'boolean': {
        const raw = params.get(item.id)
        if (raw === 'true') values[item.id as keyof FilterValues<TConfigs>] = true as never
        else if (raw === 'false') values[item.id as keyof FilterValues<TConfigs>] = false as never
        break
      }
    }
  }
  return values
}
