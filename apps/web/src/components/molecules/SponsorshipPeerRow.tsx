'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { Button } from '@/components/atoms/Button'

type Props = {
  href: string
  name: string
  badge: ReactNode
  onRemove?: () => void
  removing?: boolean
  removeLabel?: string
}

export function SponsorshipPeerRow({
  href,
  name,
  badge,
  onRemove,
  removing,
  removeLabel = 'Retirer le lien',
}: Props) {
  return (
    <li className="flex items-center gap-3 rounded-md border border-border bg-white px-3 py-2.5 shadow-sm">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        <Link
          href={href}
          className="truncate text-sm font-semibold text-accent hover:underline"
        >
          {name}
        </Link>
        {badge}
      </div>
      {onRemove ? (
        <Button
          type="button"
          variant="outline"
          disabled={removing}
          onClick={onRemove}
          className="shrink-0 px-3 py-1.5 text-xs"
          aria-label={`${removeLabel} — ${name}`}
        >
          {removing ? '…' : removeLabel}
        </Button>
      ) : null}
    </li>
  )
}
