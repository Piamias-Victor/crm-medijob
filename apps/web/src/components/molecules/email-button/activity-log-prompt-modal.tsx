'use client'

import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GlassModal } from '@/components/molecules/GlassModal'
import { Button } from '@/components/atoms/Button'
import { Textarea } from '@/components/atoms/Textarea'
import { FormField } from '@/components/molecules/FormField'
import type { ActivityLogScope } from '@/view-models/activity-log.types'
import {
  activityLogEmailPromptSchema,
  type ActivityLogEmailPromptInput,
} from '@/view-models/activity-log-email-prompt.schema'
import { useActivityLogEmailSave } from '@/lib/hooks/use-activity-log-email-save'
import {
  ACTIVITY_LOG_PROMPT_TITLE,
  ACTIVITY_LOG_SAVE,
  ACTIVITY_LOG_SAVE_PENDING,
  ACTIVITY_LOG_SKIP,
} from '@/components/molecules/email-button/email-button-copy'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultContent: string
  scopes: ActivityLogScope[]
}

export function ActivityLogPromptModal({ open, onOpenChange, defaultContent, scopes }: Props) {
  const contentId = useId()
  const { saveOrToastError, isPending } = useActivityLogEmailSave(scopes, () => onOpenChange(false))
  const { register, handleSubmit, reset } = useForm<ActivityLogEmailPromptInput>({
    resolver: zodResolver(activityLogEmailPromptSchema),
    defaultValues: { content: defaultContent },
  })

  useEffect(() => {
    if (open) reset({ content: defaultContent })
  }, [open, defaultContent, reset])

  const close = () => {
    if (!isPending) onOpenChange(false)
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      await saveOrToastError(data.content)
    } catch {
      // Toast handled in hook
    }
  })

  return (
    <GlassModal open={open} onClose={close} title={ACTIVITY_LOG_PROMPT_TITLE} className="max-w-md">
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField label="Contenu" htmlFor={contentId}>
          <Textarea id={contentId} rows={3} disabled={isPending} {...register('content')} />
        </FormField>
        <div className="flex justify-end gap-3 border-t border-border/50 pt-4">
          <Button type="button" variant="outline" onClick={close} disabled={isPending}>
            {ACTIVITY_LOG_SKIP}
          </Button>
          <Button type="submit" variant="accent" disabled={isPending} className="min-w-30">
            {isPending ? ACTIVITY_LOG_SAVE_PENDING : ACTIVITY_LOG_SAVE}
          </Button>
        </div>
      </form>
    </GlassModal>
  )
}
