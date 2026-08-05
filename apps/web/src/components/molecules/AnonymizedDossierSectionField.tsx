'use client'

import { Textarea } from '@/components/atoms/Textarea'
import { cn } from '@/lib/cn'

type Props = {
  index: number
  label: string
  value: string
  onChange: (value: string) => void
}

export function AnonymizedDossierSectionField({ index, label, value, onChange }: Props) {
  return (
    <label className="flex flex-col gap-2">
      <span className="flex items-center gap-3">
        <span
          className={cn(
            'flex size-7 shrink-0 items-center justify-center rounded-full',
            'bg-primary/10 font-mono text-[11px] font-semibold text-primary',
          )}
        >
          {String(index).padStart(2, '0')}
        </span>
        <span className="text-sm font-semibold tracking-tight text-fg">{label}</span>
      </span>
      <Textarea
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Sans nom, email ni téléphone…"
        className={cn(
          'min-h-[4.75rem] resize-y rounded-xl border-border/50 bg-white/70',
          'px-3.5 py-2.5 text-sm leading-relaxed text-fg',
          'placeholder:text-fg-muted/70 focus:border-accent focus:ring-accent-muted',
        )}
      />
    </label>
  )
}
