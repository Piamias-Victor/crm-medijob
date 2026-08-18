'use client'

import { Save } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { Textarea } from '@/components/atoms/Textarea'
import { cn } from '@/lib/cn'
import {
  cvSummarySaveButtonLabel,
  cvSummarySaveButtonVariant,
  isCvSummarySaveDisabled,
} from '@/view-models/cv-summary-save-state'

type Props = {
  value: string
  savedValue: string | null | undefined
  saving: boolean
  onChange: (value: string) => void
  onSave: () => void
  showSave?: boolean
}

export function CandidateCvSummaryEditor({
  value,
  savedValue,
  saving,
  onChange,
  onSave,
  showSave = true,
}: Props) {
  const dirty = value.trim() !== (savedValue?.trim() ?? '')
  const hasValue = Boolean(value.trim())
  const disabled = isCvSummarySaveDisabled({ dirty, saving, hasValue })
  const label = cvSummarySaveButtonLabel({ dirty, saving, hasValue })
  const variant = cvSummarySaveButtonVariant({ dirty, saving, hasValue })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-fg">Aperçu</p>
        {showSave ? (
        <Button
          variant={variant}
          disabled={disabled}
          onClick={onSave}
          className="gap-2"
          aria-label={label}
        >
          <Save className="size-4" />
          {label}
        </Button>
        ) : null}
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
      {showSave && dirty ? (
        <p className="text-xs text-fg-muted">Modifications non enregistrées — Enregistrer est vert.</p>
      ) : showSave && hasValue ? (
        <p className="text-xs text-fg-muted">
          Résumé enregistré. Modifie le texte pour réactiver Enregistrer.
        </p>
      ) : null}
    </div>
  )
}
