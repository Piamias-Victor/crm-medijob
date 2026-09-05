'use client'

import { Mail, Phone } from 'lucide-react'
import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'

type Props = {
  email: string | null
  phone: string | null
}

const linkClass = 'inline-flex items-center gap-1.5 text-accent underline-offset-2 hover:underline'

export function MissionMatchingContactLine({ email, phone }: Props) {
  if (!email && !phone) {
    return <p className="mt-2 text-xs text-fg-muted">{TABLE_EMPTY_CELL}</p>
  }

  return (
    <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
      {phone ? (
        <a href={`tel:${phone}`} onClick={(e) => e.stopPropagation()} className={linkClass}>
          <Phone className="size-3.5 shrink-0" aria-hidden />
          {phone}
        </a>
      ) : null}
      {email ? (
        <a href={`mailto:${email}`} onClick={(e) => e.stopPropagation()} className={linkClass}>
          <Mail className="size-3.5 shrink-0" aria-hidden />
          {email}
        </a>
      ) : null}
    </p>
  )
}
