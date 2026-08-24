import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'
import { formatDateFr } from '@/view-models/format-date-fr'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

type Props = { row: FacturationSuiviRow }

export function FacturationDateCell({ row }: Props) {
  return (
    <div className="whitespace-nowrap text-xs leading-5">
      <p>
        <span className="text-fg-muted">Envoyé </span>
        {row.sentAt ? formatDateFr(row.sentAt) : TABLE_EMPTY_CELL}
      </p>
      <p>
        <span className="text-fg-muted">Accepté </span>
        {row.acceptedAt ? formatDateFr(row.acceptedAt) : TABLE_EMPTY_CELL}
      </p>
    </div>
  )
}
