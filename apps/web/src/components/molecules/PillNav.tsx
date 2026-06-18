'use client'

import Link from 'next/link'
import { pillNavLinkClass } from '@/view-models/pill-nav-link'

type Item = { href: string; label: string }

type Props = {
  items: Item[]
  isActive: (href: string) => boolean
}

export function PillNav({ items, isActive }: Props) {
  return (
    <nav className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active = isActive(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={pillNavLinkClass(active)}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
