import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Props = {
  children: ReactNode
  maxWidth?: string
  label?: string
}

export function SkeletonPageShell({
  children,
  maxWidth = 'max-w-[88rem]',
  label = 'Chargement de la page',
}: Props) {
  return (
    <div
      aria-busy="true"
      aria-label={label}
      className={cn('mx-auto flex w-full flex-col gap-6', maxWidth)}
    >
      {children}
    </div>
  )
}
