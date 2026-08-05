'use client'

import { Textarea } from '@/components/atoms/Textarea'

type Props = {
  label: string
  value: string
  onChange: (value: string) => void
  onBlur: () => void
}

export function AnonymizedDossierSectionField({ label, value, onChange, onBlur }: Props) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-fg">{label}</span>
      <Textarea
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        className="min-h-[4.5rem] resize-y"
      />
    </label>
  )
}
