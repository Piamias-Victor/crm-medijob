'use client'

import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { Spinner } from '@/components/atoms/Spinner'
import { GlassModal } from '@/components/molecules/GlassModal'
import { CvthequeExportColumnPicker } from '@/components/organisms/cvtheque-table/cvtheque-export-column-picker'
import type { EntityTableSortState } from '@/components/organisms/entity-table/entity-table-types'
import { useCvthequeExportColumns } from '@/lib/hooks/use-cvtheque-export-columns'
import { useCvthequeExportDownload } from '@/lib/hooks/use-cvtheque-export-download'
import type { CandidateListFilters } from '@/view-models/candidate-list-filters.schema'

type Props = {
  open: boolean
  onClose: () => void
  filters: CandidateListFilters
  sort: EntityTableSortState | null
}

const EMPTY_TOOLTIP = 'Aucune colonne sélectionnée'

export function CvthequeExportModal({ open, onClose, filters, sort }: Props) {
  const { selected, toggle } = useCvthequeExportColumns(open)
  const { download, loading } = useCvthequeExportDownload(filters, sort, onClose)

  return (
    <GlassModal
      open={open}
      onClose={onClose}
      title="Exporter la CVthèque"
      description="Choisissez les colonnes à inclure dans le fichier CSV."
      className="max-w-lg"
      trapFocus
    >
      <div className="space-y-4">
        <CvthequeExportColumnPicker selected={selected} onToggle={toggle} />
        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button
            type="button"
            variant="accent"
            onClick={() => download(selected)}
            disabled={loading || selected.length === 0}
            title={selected.length === 0 ? EMPTY_TOOLTIP : undefined}
            className="gap-2"
          >
            {loading ? <Spinner className="size-4 border-accent-fg/40 border-t-accent-fg" /> : <Download className="size-4" />}
            Télécharger
          </Button>
        </div>
      </div>
    </GlassModal>
  )
}
