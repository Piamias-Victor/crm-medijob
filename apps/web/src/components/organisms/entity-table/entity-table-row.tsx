'use client'

import { useRouter } from 'next/navigation'
import type { KeyboardEvent, ReactNode } from 'react'

type Props<TRow> = {
  row: TRow
  columns: { id: string; cell?: (row: TRow) => ReactNode; accessor: (row: TRow) => unknown }[]
  hasActions: boolean
  renderActions?: (row: TRow) => ReactNode
  getRowHref?: (row: TRow) => string
}

export function EntityTableRow<TRow>({
  row,
  columns,
  hasActions,
  renderActions,
  getRowHref,
}: Props<TRow>) {
  const router = useRouter()
  const href = getRowHref?.(row)
  const clickable = Boolean(href)

  const navigate = () => {
    if (href) router.push(href)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLTableRowElement>) => {
    if (!clickable) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      navigate()
    }
  }

  return (
    <tr
      role={clickable ? 'link' : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-label={clickable ? 'Ouvrir la fiche candidat' : undefined}
      className={`border-t border-border/70 transition-colors hover:bg-surface/60 ${
        clickable ? 'cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent' : ''
      }`}
      onClick={clickable ? navigate : undefined}
      onKeyDown={onKeyDown}
    >
      {columns.map((column) => (
        <td key={column.id} className="px-3 py-2 text-fg">
          {column.cell ? column.cell(row) : String(column.accessor(row) ?? '—')}
        </td>
      ))}
      {hasActions ? (
        <td className="px-3 py-2 text-right" onClick={(event) => event.stopPropagation()}>
          {renderActions?.(row)}
        </td>
      ) : null}
    </tr>
  )
}
