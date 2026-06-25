'use client'

/** Single exclusive choice (e.g. titulaire) — use CheckboxGroup for multi-select filters. */
import { Star } from 'lucide-react'
import { cn } from '@/lib/cn'

type Props = {
  checked: boolean
  onChange: (checked: boolean) => void
  id?: string
}

export function PrimaryToggle({ checked, onChange, id = 'is-primary' }: Props) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all',
        checked
          ? 'border-accent bg-accent-muted/50 shadow-sm shadow-accent/20'
          : 'border-border bg-white hover:border-accent/40 hover:bg-surface',
      )}
    >
      <input
        id={id}
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        className={cn(
          'grid size-9 shrink-0 place-items-center rounded-lg transition-colors',
          checked ? 'bg-accent text-accent-fg shadow-md shadow-accent/30' : 'bg-surface text-fg-muted',
        )}
      >
        <Star className={cn('size-4', checked && 'fill-current')} />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-fg">Titulaire principal</span>
        <span className="text-xs leading-relaxed text-fg-muted">
          Un seul titulaire par pharmacie. Cocher remplace le titulaire principal actuel.
        </span>
      </span>
    </label>
  )
}
