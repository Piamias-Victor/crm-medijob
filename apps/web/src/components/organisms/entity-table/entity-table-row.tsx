'use client'

import { useRouter } from 'next/navigation'
import type { KeyboardEvent, ReactNode } from 'react'

type Props<TRow> = {
  row: TRow
  columns: { id: string; cell?: (row: TRow) => ReactNode; accessor: (row: TRow) => unknown }[]
  hasActions: boolean
  renderActions?: (row: TRow) => ReactNode
  getRowHref?: (row: TRow) => string
  onRowClick?: (row: TRow) => void
}

export function EntityTableRow<TRow>({
  row,
  columns,
  hasActions,
  renderActions,
  getRowHref,
  onRowClick,
}: Props<TRow>) {
  const router = useRouter()
  const href = getRowHref?.(row)
  const clickable = Boolean(onRowClick) || Boolean(href)

  const activate = () => {
    if (onRowClick) {
      onRowClick(row)
      return
    }
    if (href) router.push(href)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLTableRowElement>) => {
    if (!clickable) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      activate()
    }
  }

  return (
    <tr
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-label={clickable ? (onRowClick ? 'Ouvrir l’aperçu' : 'Ouvrir la fiche') : undefined}
      className={`border-t border-border/70 transition-colors hover:bg-surface/60 ${
        clickable ? 'cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent' : ''
      }`}
      onClick={clickable ? activate : undefined}
      onKeyDown={onKeyDown}
    >
      {columns.map((column) => (
        <td key={column.id} className="px-3 py-2 text-fg">
          {column.cell ? column.cell(row) : String(column.accessor(row) ?? '—')}
        </td>
      ))}
      {hasActions ? (
        <td
          className="sticky right-0 bg-surface px-3 py-2 text-right shadow-[-6px_0_8px_-6px_rgb(0_0_0/0.08)]"
          onClick={(event) => event.stopPropagation()}
        >
          {renderActions?.(row)}
        </td>
      ) : null}
    </tr>
  )
}
