import { cn } from '@/lib/cn'
import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'

type Props = {
  text: string | null | undefined
  className?: string
}

export function TruncatedText({ text, className }: Props) {
  const value = text?.trim() ? text : TABLE_EMPTY_CELL
  return (
    <span className={cn('block max-w-[12rem] truncate', className)} title={value}>
      {value}
    </span>
  )
}
