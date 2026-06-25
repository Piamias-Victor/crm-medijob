'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { RotateCcw, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { EntityListAdvancedFiltersPanel } from '@/components/organisms/entity-list-filter-bar/entity-list-advanced-filters-panel'
import { FilterBarField } from '@/components/organisms/filter-bar/filter-bar-field'
import type { FilterConfig, FilterValues } from '@/lib/filters/filter-types'
import { useOutsidePointerClose } from '@/lib/hooks/use-outside-pointer-close'
import { useAnchoredPanel } from '@/lib/use-anchored-panel'

type Props<TValues extends FilterValues<readonly FilterConfig[]>> = {
  primary: FilterConfig[]
  advanced: FilterConfig[]
  values: TValues
  onChange: (values: TValues) => void
  onReset: () => void
  advancedCount: number
  trailing?: ReactNode
}

export function EntityListFilterBar<TValues extends FilterValues<readonly FilterConfig[]>>({
  primary,
  advanced,
  values,
  onChange,
  onReset,
  advancedCount,
  trailing,
}: Props<TValues>) {
  const [open, setOpen] = useState(false)
  const panel = useAnchoredPanel(open, 360)
  useOutsidePointerClose(open, () => setOpen(false), panel.anchorRef, panel.panelRef)
  const showAdvanced = useMemo(() => advanced.length > 0, [advanced.length])

  return (
    <div className="flex flex-wrap items-end gap-2 rounded-lg border border-border bg-surface px-3 py-2">
      {primary.map((item) => (
        <FilterBarField
          key={item.id}
          config={item}
          values={values}
          onChange={(next) => onChange(next as TValues)}
        />
      ))}
      {showAdvanced ? (
        <div ref={panel.anchorRef} className="relative">
          <Button type="button" variant="outline" className="h-[38px] gap-2" onClick={() => setOpen((v) => !v)}>
            <SlidersHorizontal className="size-4" />
            Plus de filtres
            {advancedCount > 0 ? (
              <span className="rounded-full bg-accent px-1.5 py-0.5 text-xs text-accent-fg">{advancedCount}</span>
            ) : null}
          </Button>
          {open && panel.style && typeof document !== 'undefined'
            ? createPortal(
                <EntityListAdvancedFiltersPanel
                  advanced={advanced}
                  values={values}
                  onChange={onChange}
                  panelRef={panel.panelRef}
                  style={panel.style}
                />,
                document.body,
              )
            : null}
        </div>
      ) : null}
      <div className="ml-auto flex shrink-0 items-center gap-2">
        {trailing}
        <Button type="button" variant="ghost" onClick={onReset} className="h-[38px] shrink-0 px-2 py-1.5 text-sm">
          <RotateCcw className="size-4" />
          Réinitialiser
        </Button>
      </div>
    </div>
  )
}
