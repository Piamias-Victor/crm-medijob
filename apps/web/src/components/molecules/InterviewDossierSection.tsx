'use client'

import { InterviewDocUpload } from '@/components/molecules/InterviewDocUpload'
import { CheckboxChip } from '@/components/molecules/CheckboxChip'
import { INTERVIEW_CHECKLIST_TITLE } from '@/view-models/interview-copy'
import { cn } from '@/lib/cn'

type Item = { id: string; label: string }

type Props = {
  candidateId: string
  items: Item[]
  selected: string[]
  disabled?: boolean
  onChange: (selected: string[]) => void
  onUploaded: (itemId: string) => void
}

export function InterviewDossierSection({
  candidateId,
  items,
  selected,
  disabled,
  onChange,
  onUploaded,
}: Props) {
  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((value) => value !== id) : [...selected, id])
  }

  return (
    <section id="dossier" className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-fg">{INTERVIEW_CHECKLIST_TITLE}</h2>
      <div className="flex flex-col gap-2">
        {items.map((item) => {
          const checked = selected.includes(item.id)
          return (
            <div
              key={item.id}
              className={cn(
                'flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2',
                checked ? 'border-accent bg-accent-muted' : 'border-border bg-white',
              )}
            >
              <CheckboxChip
                label={item.label}
                checked={checked}
                disabled={disabled}
                onChange={() => toggle(item.id)}
              />
              <InterviewDocUpload
                candidateId={candidateId}
                disabled={disabled}
                onUploaded={() => onUploaded(item.id)}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}
