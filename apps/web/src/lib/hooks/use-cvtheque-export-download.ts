'use client'

import { useState } from 'react'
import { TRPCClientError } from '@trpc/client'
import type { EntityTableSortState } from '@/components/organisms/entity-table/entity-table-types'
import { downloadBlob } from '@/lib/csv/download-blob'
import { formatCsvFilename } from '@/lib/csv/format-csv-filename'
import { toCandidateExportSort } from '@/lib/cvtheque-export-sort'
import { trpc } from '@/lib/trpc/client'
import { useToastStore } from '@/stores/toast-store'
import type { CvthequeExportColumnId } from '@/view-models/cvtheque-export-column-ids'
import type { CandidateListFilters } from '@/view-models/candidate-list-filters.schema'

const EXPORT_ERROR = "Impossible d'exporter le CSV"
const AUTH_ERROR = 'Session expirée — reconnectez-vous'

const NETWORK_ERROR = 'Erreur réseau — réessayez'

export function useCvthequeExportDownload(
  filters: CandidateListFilters,
  sort: EntityTableSortState | null,
  onSuccess: () => void,
) {
  const push = useToastStore((s) => s.push)
  const client = trpc.useUtils().client
  const [loading, setLoading] = useState(false)

  async function download(selected: CvthequeExportColumnId[]) {
    setLoading(true)
    try {
      const result = await client.candidate.exportCsv.query({
        ...filters,
        columnIds: selected,
        sort: toCandidateExportSort(sort),
      })
      if (result.rowCount === 0) {
        push({ variant: 'warning', message: 'Aucune donnée' })
        return
      }
      downloadBlob(result.csv, formatCsvFilename('cvtheque'))
      onSuccess()
    } catch (error) {
      if (error instanceof TRPCClientError && error.data?.code === 'UNAUTHORIZED') {
        push({ variant: 'error', message: AUTH_ERROR })
        return
      }
      if (error instanceof TypeError) {
        push({ variant: 'error', message: NETWORK_ERROR })
        return
      }
      push({ variant: 'error', message: EXPORT_ERROR })
    } finally {
      setLoading(false)
    }
  }

  return { download, loading }
}
