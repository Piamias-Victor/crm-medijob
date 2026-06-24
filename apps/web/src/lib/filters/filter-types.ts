export type FilterOption = { value: string; label: string }

export type DateRangeValue = { from: string; to: string }
export type NumberRangeValue = { min: string; max: string }

type FilterConfigBase<TId extends string> = {
  id: TId
  label: string
}

export type SelectFilterConfig<TId extends string = string> = FilterConfigBase<TId> & {
  type: 'select'
  options: readonly FilterOption[]
  placeholder?: string
}

export type MultiSelectFilterConfig<TId extends string = string> = FilterConfigBase<TId> & {
  type: 'multi-select'
  options: readonly FilterOption[]
  /** Libellé court pluriel affiché quand plusieurs valeurs (ex. « métiers », « dpt »). */
  unit?: string
}

export type TextFilterConfig<TId extends string = string> = FilterConfigBase<TId> & {
  type: 'text'
  placeholder?: string
}

export type DateRangeFilterConfig<TId extends string = string> = FilterConfigBase<TId> & {
  type: 'date-range'
}

export type NumberRangeFilterConfig<TId extends string = string> = FilterConfigBase<TId> & {
  type: 'number-range'
}

export type BooleanFilterConfig<TId extends string = string> = FilterConfigBase<TId> & {
  type: 'boolean'
}

export type FilterConfig<TId extends string = string> =
  | SelectFilterConfig<TId>
  | MultiSelectFilterConfig<TId>
  | TextFilterConfig<TId>
  | DateRangeFilterConfig<TId>
  | NumberRangeFilterConfig<TId>
  | BooleanFilterConfig<TId>

export type FilterValueFor<C extends FilterConfig> = C extends SelectFilterConfig
  ? string
  : C extends MultiSelectFilterConfig
    ? string[]
    : C extends TextFilterConfig
      ? string
      : C extends DateRangeFilterConfig
        ? DateRangeValue
        : C extends NumberRangeFilterConfig
          ? NumberRangeValue
          : C extends BooleanFilterConfig
            ? boolean | null
            : never

export type FilterValues<TConfigs extends readonly FilterConfig[]> = {
  [C in TConfigs[number] as C['id']]: FilterValueFor<C>
}

export function buildDefaultFilterValues<TConfigs extends readonly FilterConfig[]>(
  config: TConfigs,
): FilterValues<TConfigs> {
  const result = {} as Record<string, unknown>
  for (const item of config) {
    switch (item.type) {
      case 'select':
      case 'text':
        result[item.id] = ''
        break
      case 'multi-select':
        result[item.id] = []
        break
      case 'date-range':
        result[item.id] = { from: '', to: '' }
        break
      case 'number-range':
        result[item.id] = { min: '', max: '' }
        break
      case 'boolean':
        result[item.id] = null
        break
    }
  }
  return result as FilterValues<TConfigs>
}
