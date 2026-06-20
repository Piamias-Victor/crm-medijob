import Link from 'next/link'
import { ArrowLeft, Briefcase, MapPin, User, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { SURFACE_GLASS_PANEL } from '@/lib/constants/surface-glass'

export type DetailMetaChip = {
  icon: LucideIcon
  label: string
  tone?: 'neutral' | 'accent'
}

type Props = {
  backHref: string
  backLabel: string
  name: string
  jobTitle?: string
  city?: string
  referentName?: string
  chips?: DetailMetaChip[]
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function MetaChip({
  icon: Icon,
  label,
  tone = 'neutral',
}: {
  icon: LucideIcon
  label: string
  tone?: 'neutral' | 'accent'
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        tone === 'accent'
          ? 'border-accent/25 bg-accent-muted/80 text-accent-hover'
          : 'border-border/60 bg-surface/70 text-fg-muted',
      )}
    >
      <Icon className="size-3 shrink-0" aria-hidden />
      {label}
    </span>
  )
}

export function DetailPageHeader({
  backHref,
  backLabel,
  name,
  jobTitle,
  city,
  referentName,
  chips,
}: Props) {
  return (
    <section className={SURFACE_GLASS_PANEL}>
      <header className="border-b border-border/80 bg-gradient-to-r from-primary-muted/55 via-surface to-accent-muted/45 px-5 py-4">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-fg-muted transition-colors hover:text-accent-hover"
        >
          <ArrowLeft className="size-3.5 shrink-0" aria-hidden />
          {backLabel}
        </Link>
        <div className="mt-4 flex items-start gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-hover text-lg font-bold text-accent-fg shadow-md shadow-accent/30">
            {initials(name) || '?'}
          </span>
          <div className="min-w-0 space-y-3">
            <h1 className="text-2xl font-bold tracking-tight text-fg">{name}</h1>
            <div className="flex flex-wrap gap-2">
              {jobTitle ? <MetaChip icon={Briefcase} label={jobTitle} /> : null}
              {city ? <MetaChip icon={MapPin} label={city} /> : null}
              {referentName ? (
                <MetaChip icon={User} label={`Référent · ${referentName}`} tone="accent" />
              ) : null}
              {chips?.map((chip) => (
                <MetaChip key={chip.label} icon={chip.icon} label={chip.label} tone={chip.tone} />
              ))}
            </div>
          </div>
        </div>
      </header>
    </section>
  )
}
