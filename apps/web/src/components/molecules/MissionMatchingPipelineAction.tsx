'use client'

import { Check, UserPlus } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { DEFAULT_PIPELINE_STAGE_NAME } from '@/lib/pipeline-constants'

type Props = {
  positioned: boolean
  pending: boolean
  disabled?: boolean
  onAdd: () => void
}

export function MissionMatchingPipelineAction({
  positioned,
  pending,
  disabled,
  onAdd,
}: Props) {
  if (positioned) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-success/25 bg-success/10 px-3 py-1.5 text-xs font-medium text-success">
        <Check className="size-3.5" aria-hidden />
        Déjà dans le pipeline
      </span>
    )
  }

  return (
    <Button
      type="button"
      variant="accent"
      disabled={disabled || pending}
      onClick={(event) => {
        event.stopPropagation()
        onAdd()
      }}
      className="w-full shrink-0 gap-1.5 px-3 py-2 text-xs font-semibold shadow-sm"
      aria-label={`Ajouter au pipeline ${DEFAULT_PIPELINE_STAGE_NAME}`}
    >
      <UserPlus className="size-3.5" aria-hidden />
      {pending ? 'Ajout…' : 'Ajouter au pipeline'}
    </Button>
  )
}
