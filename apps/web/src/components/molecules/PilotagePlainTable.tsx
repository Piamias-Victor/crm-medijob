import { cn } from '@/lib/cn'

export type PilotagePlainRow = {
  id: string
  cells: string[]
}

type Props = {
  headers: readonly string[]
  rows: PilotagePlainRow[]
  onRowClick?: (id: string) => void
  selectedId?: string | null
}

export function PilotagePlainTable({ headers, rows, onRowClick, selectedId }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-sm">
        <thead className="border-b border-border/80 bg-gradient-to-r from-primary-muted/80 via-primary-muted/50 to-accent-muted/70">
          <tr>
            {headers.map((header, index) => (
              <th
                key={`${header}-${index}`}
                scope="col"
                className={cn(
                  'px-3 py-2 text-xs font-semibold uppercase tracking-wide text-primary',
                  index === 0 ? 'text-left' : 'text-right',
                )}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <PlainRow
              key={row.id}
              row={row}
              clickable={Boolean(onRowClick)}
              selected={selectedId === row.id}
              onClick={onRowClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

type RowProps = {
  row: PilotagePlainRow
  clickable: boolean
  selected: boolean
  onClick?: (id: string) => void
}

function PlainRow({ row, clickable, selected, onClick }: RowProps) {
  return (
    <tr
      className={cn(
        'border-b border-border/60',
        clickable && 'cursor-pointer hover:bg-primary-muted/40',
        selected && 'bg-accent-muted/50',
      )}
      onClick={clickable ? () => onClick?.(row.id) : undefined}
    >
      {row.cells.map((cell, index) => (
        <td key={`${row.id}-${index}`} className={cn('px-3 py-2', index === 0 ? '' : 'text-right tabular-nums')}>
          {cell}
        </td>
      ))}
    </tr>
  )
}
