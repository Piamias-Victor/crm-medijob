'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { CvthequeExportModal } from '@/components/organisms/cvtheque-table/cvtheque-export-modal'
import type { EntityTableSortState } from '@/components/organisms/entity-table/entity-table-types'
import type { CandidateListFilters } from '@/view-models/candidate-list-filters.schema'

type Props = {
  filters: CandidateListFilters
  sort: EntityTableSortState | null
  disabled?: boolean
}

export function CvthequeExportButton({ filters, sort, disabled = false }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        type="button"
        variant="accent"
        onClick={() => setOpen(true)}
        disabled={disabled}
        className="h-[38px] shrink-0 px-2 py-1.5 text-sm"
      >
        <Download className="size-4" />
        Exporter CSV
      </Button>
      <CvthequeExportModal open={open} onClose={() => setOpen(false)} filters={filters} sort={sort} />
    </>
  )
}
