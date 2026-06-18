import Link from 'next/link'
import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { LIST_CARD_SHELL_CLASS } from '@/lib/constants/list-card'

type Props = {
  href?: string
  children: ReactNode
  className?: string
}

export function ListCardShell({ href, children, className }: Props) {
  const classes = cn(LIST_CARD_SHELL_CLASS, className)

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return <article className={classes}>{children}</article>
}
