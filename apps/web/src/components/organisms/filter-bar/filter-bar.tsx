'use client'

import { type ReactNode } from 'react'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { FilterBarField } from '@/components/organisms/filter-bar/filter-bar-field'
import type { FilterConfig, FilterValues } from '@/lib/filters/filter-types'

export type FilterBarProps<TConfigs extends readonly FilterConfig[]> = {
  config: TConfigs
  values: FilterValues<TConfigs>
  onChange: (values: FilterValues<TConfigs>) => void
  onReset: () => void
  actions?: ReactNode
  wrap?: boolean
}

export function FilterBar<TConfigs extends readonly FilterConfig[]>({
  config,
  values,
  onChange,
  onReset,
  actions,
  wrap = false,
}: FilterBarProps<TConfigs>) {
  return (
    <div
      className={`flex items-end gap-2 rounded-lg border border-border bg-surface px-3 py-2 ${
        wrap ? 'flex-wrap' : 'overflow-x-auto'
      }`}
    >
      {config.map((item) => (
        <FilterBarField key={item.id} config={item} values={values} onChange={onChange} />
      ))}
      <div className="ml-auto flex shrink-0 items-center gap-2">
        {actions}
        <Button type="button" variant="ghost" onClick={onReset} className="h-[38px] shrink-0 px-2 py-1.5 text-sm">
          <RotateCcw className="size-4" />
          Réinitialiser
        </Button>
      </div>
    </div>
  )
}
