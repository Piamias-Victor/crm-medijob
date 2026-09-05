import Link from 'next/link'
import { interimExtraLinks } from '@/view-models/interim-nav-items'

export function InterimSecondaryLinks() {
  return (
    <nav aria-label="Archives Badakan" className="flex flex-wrap gap-1.5">
      {interimExtraLinks().map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-white px-2.5 py-1 text-xs font-medium text-fg-muted hover:border-accent/35 hover:text-fg"
          >
            <Icon className="size-3.5" aria-hidden />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
