'use client'

import { Textarea } from '@/components/atoms/Textarea'
import { cn } from '@/lib/cn'

type Props = {
  index: number
  label: string
  value: string
  onChange: (value: string) => void
  onBlur: () => void
}

export function AnonymizedDossierSectionField({
  index,
  label,
  value,
  onChange,
  onBlur,
}: Props) {
  return (
    <label className="group flex flex-col gap-2">
      <span className="flex items-baseline gap-2">
        <span className="font-mono text-xs tabular-nums text-fg-muted">{String(index).padStart(2, '0')}</span>
        <span className="text-sm font-semibold tracking-tight text-fg">{label}</span>
      </span>
      <Textarea
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder="Texte libre, sans nom ni coordonnées…"
        className={cn(
          'min-h-[5rem] resize-y rounded-none border-0 border-b border-border/80',
          'bg-transparent px-0 py-2 font-serif text-[15px] leading-7 text-fg',
          'shadow-none focus:border-accent focus:ring-0',
        )}
      />
    </label>
  )
}
