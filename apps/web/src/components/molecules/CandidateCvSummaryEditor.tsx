'use client'

import { Save } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { Textarea } from '@/components/atoms/Textarea'
import { cn } from '@/lib/cn'
import {
  cvSummarySaveButtonLabel,
  isCvSummarySaveDisabled,
} from '@/view-models/cv-summary-save-state'

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
  const dirty = value.trim() !== (savedValue?.trim() ?? '')
  const hasValue = Boolean(value.trim())
  const disabled = isCvSummarySaveDisabled({ dirty, saving, hasValue })
  const label = cvSummarySaveButtonLabel({ dirty, saving, hasValue })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-fg">Aperçu</p>
        <Button
          variant="primary"
          disabled={disabled}
          onClick={onSave}
          className="gap-2"
          aria-label={label}
        >
          <Save className="size-4" />
          {label}
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
      ) : hasValue ? (
        <p className="text-xs text-fg-muted">
          Résumé enregistré. Modifie le texte pour réactiver Enregistrer.
        </p>
      ) : null}
    </div>
  )
}
