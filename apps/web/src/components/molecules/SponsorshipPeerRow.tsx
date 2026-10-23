'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

type Props = {
  href: string
  name: string
  badge: ReactNode
  onRemove?: () => void
  removing?: boolean
}

export function SponsorshipPeerRow({ href, name, badge, onRemove, removing }: Props) {
  return (
    <li className="flex flex-wrap items-center gap-2 text-sm">
      <Link href={href} className="font-medium text-accent hover:underline">
        {name}
      </Link>
      {badge}
      {onRemove ? (
        <button
          type="button"
          className="text-xs text-fg-muted hover:text-danger"
          disabled={removing}
          onClick={onRemove}
        >
          Retirer
        </button>
      ) : null}
    </li>
  )
}
