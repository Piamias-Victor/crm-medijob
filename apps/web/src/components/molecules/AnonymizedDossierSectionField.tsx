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
    <label
      className={cn(
        'flex flex-col gap-3 rounded-2xl border border-border/60 bg-white/90 p-5',
        'shadow-[0_1px_0_rgb(255_255_255/0.8)_inset]',
      )}
    >
      <span className="flex items-center gap-3">
        <span
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-full',
            'bg-primary text-[12px] font-semibold text-primary-fg',
          )}
        >
          {String(index).padStart(2, '0')}
        </span>
        <span className="text-base font-semibold tracking-tight text-fg">{label}</span>
      </span>
      <Textarea
        rows={5}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Sans nom, email ni téléphone…"
        className={cn(
          'min-h-[8.5rem] resize-y rounded-xl border-border/40 bg-primary-muted/35',
          'px-4 py-3.5 text-base leading-7 text-fg',
          'placeholder:text-fg-muted/60 focus:border-accent focus:ring-accent-muted',
        )}
      />
    </label>
  )
}
