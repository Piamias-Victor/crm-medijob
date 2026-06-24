'use client'

import { Download } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { Spinner } from '@/components/atoms/Spinner'
import { buildCsv } from '@/lib/csv/build-csv'
import { downloadBlob } from '@/lib/csv/download-blob'
import { formatCsvFilename } from '@/lib/csv/format-csv-filename'
import { useToastStore } from '@/stores/toast-store'

type BaseProps = {
  filename: string
  headers: string[]
}

type SyncProps = BaseProps & {
  rows: string[][]
  getData?: never
}

type AsyncProps = BaseProps & {
  getData: () => Promise<string[][]>
  rows?: never
}

export type ExportCsvButtonProps = SyncProps | AsyncProps

const EMPTY_TOOLTIP = 'Aucune donnée'
const EXPORT_ERROR = "Impossible d'exporter le CSV"

export function ExportCsvButton(props: ExportCsvButtonProps) {
  const { filename, headers } = props
  const push = useToastStore((s) => s.push)
  const [loading, setLoading] = useState(false)
  const isEmpty = props.rows !== undefined && props.rows.length === 0
  const disabled = loading || isEmpty

  async function handleClick() {
    setLoading(true)
    try {
      const rows = props.getData ? await props.getData() : props.rows
      if (rows.length === 0) {
        push({ variant: 'warning', message: EMPTY_TOOLTIP })
        return
      }
      downloadBlob(buildCsv(headers, rows), formatCsvFilename(filename))
    } catch {
      push({ variant: 'error', message: EXPORT_ERROR })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant="accent"
      onClick={handleClick}
      disabled={disabled}
      title={isEmpty ? EMPTY_TOOLTIP : undefined}
      className="h-[38px] shrink-0 px-2 py-1.5 text-sm"
    >
      {loading ? (
        <Spinner className="size-4 border-accent-fg/40 border-t-accent-fg" />
      ) : (
        <Download className="size-4" />
      )}
      Exporter CSV
    </Button>
  )
}
