import { Phone } from 'lucide-react'
import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'
import type { SearchAppliedItem } from '@/view-models/badakan-mission-detail'

export function BadakanSearchAppliedRow({ row }: { row: SearchAppliedItem }) {
  return (
    <li className="flex items-center justify-between gap-3 py-3">
      <span className="text-sm font-medium text-fg">{row.fullName}</span>
      {row.telHref && row.phone ? (
        <a
          href={row.telHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover"
        >
          <Phone className="size-3.5" aria-hidden />
          {row.phone}
        </a>
      ) : (
        <span className="text-sm text-fg-muted">{TABLE_EMPTY_CELL}</span>
      )}
    </li>
  )
}
