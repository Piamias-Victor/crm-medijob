'use client'

import { useEffect, useMemo, useState } from 'react'
import { Save } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { Textarea } from '@/components/atoms/Textarea'
import { cn } from '@/lib/cn'

type Props = {
  value: string
  savedValue: string | null | undefined
  saving: boolean
  onChange: (value: string) => void
  onSave: () => void
}

export function CandidateCvSummaryEditor({
  value,
  savedValue,
  saving,
  onChange,
  onSave,
}: Props) {
  const dirty = useMemo(
    () => value.trim() !== (savedValue?.trim() ?? ''),
    [value, savedValue],
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-fg">Aperçu</p>
        <Button
          variant="primary"
          disabled={!dirty || !value.trim() || saving}
          onClick={onSave}
          className="gap-2"
        >
          <Save className="size-4" />
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </div>
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={10}
        placeholder="Générez un résumé IA ou rédigez-le manuellement…"
        className={cn(
          'min-h-48 resize-y rounded-xl border-border/70 bg-white/90 px-4 py-3',
          'font-serif text-[15px] leading-7 text-fg shadow-sm',
        )}
      />
      {dirty ? (
        <p className="text-xs text-fg-muted">Modifications non enregistrées.</p>
      ) : null}
    </div>
  )
}
