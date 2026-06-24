'use client'

import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { RotateCcw, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { CvthequeExportButton } from '@/components/organisms/cvtheque-table/cvtheque-export-button'
import { CvthequeAdvancedFiltersPanel } from '@/components/organisms/cvtheque-table/cvtheque-advanced-filters-panel'
import { CvthequeFilterField } from '@/components/organisms/cvtheque-table/cvtheque-filter-field'
import type { EntityTableSortState } from '@/components/organisms/entity-table/entity-table-types'
import type { CvthequeFilterConfig } from '@/lib/filters/cvtheque-filter-config'
import type { CvthequeFilterValues } from '@/lib/filters/cvtheque-filter-map'
import {
  buildCvthequeFilterDefaults,
  countActiveAdvancedFilters,
  splitCvthequeFilterConfig,
} from '@/lib/filters/cvtheque-filter-utils'
import { useOutsidePointerClose } from '@/lib/hooks/use-outside-pointer-close'
import { useAnchoredPanel } from '@/lib/use-anchored-panel'
import type { CandidateListFilters } from '@/view-models/candidate-list-filters.schema'

type Props = {
  filterConfig: CvthequeFilterConfig
  values: CvthequeFilterValues
  onChange: (values: CvthequeFilterValues) => void
  onReset: () => void
  exportFilters: CandidateListFilters
  sort: EntityTableSortState | null
  exportDisabled?: boolean
}

export function CvthequeFilterBar({
  filterConfig,
  values,
  onChange,
  onReset,
  exportFilters,
  sort,
  exportDisabled = false,
}: Props) {
  const [open, setOpen] = useState(false)
  const { primary, advanced } = useMemo(() => splitCvthequeFilterConfig(filterConfig), [filterConfig])
  const defaults = useMemo(() => buildCvthequeFilterDefaults(filterConfig), [filterConfig])
  const advancedCount = countActiveAdvancedFilters(values, defaults)
  const panel = useAnchoredPanel(open, 360)
  useOutsidePointerClose(open, () => setOpen(false), panel.anchorRef, panel.panelRef)

  return (
    <div className="flex flex-wrap items-end gap-2 rounded-lg border border-border bg-surface px-3 py-2">
      {primary.map((item) => (
        <CvthequeFilterField key={item.id} config={item} values={values} onChange={onChange} />
      ))}
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
              <CvthequeAdvancedFiltersPanel
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
      <div className="ml-auto flex shrink-0 items-center gap-2">
        <CvthequeExportButton filters={exportFilters} sort={sort} disabled={exportDisabled} />
        <Button type="button" variant="ghost" onClick={onReset} className="h-[38px] shrink-0 px-2 py-1.5 text-sm">
          <RotateCcw className="size-4" />
          Réinitialiser
        </Button>
      </div>
    </div>
  )
}
