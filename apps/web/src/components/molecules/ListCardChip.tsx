import { type LucideIcon } from 'lucide-react'
import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { LIST_CARD_CHIP_CLASS } from '@/lib/constants/list-card'

type Props = {
  icon?: LucideIcon
  children: ReactNode
  className?: string
}

export function ListCardChip({ icon: Icon, children, className }: Props) {
  return (
    <span className={cn(LIST_CARD_CHIP_CLASS, className)}>
      {Icon ? <Icon className="size-3 shrink-0" aria-hidden /> : null}
      <span className="truncate">{children}</span>
    </span>
  )
}
