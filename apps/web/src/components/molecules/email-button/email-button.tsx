'use client'

import { useEffect, useRef, useState } from 'react'
import { Mail } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { buildComposeUrl } from '@/lib/mailto/build-compose-url'
import { DEFAULT_COMPOSE_CLIENT, type ComposeClient } from '@/lib/mailto/compose-client'
import { hasValidComposeRecipients } from '@/lib/mailto/has-valid-compose-recipients'
import { openEmailCompose } from '@/lib/mailto/open-email-compose'
import { scheduleActivityLogPrompt } from '@/lib/mailto/schedule-activity-log-prompt'
import { ActivityLogPromptModal } from '@/components/molecules/email-button/activity-log-prompt-modal'
import {
  activityLogScopesFromContext,
  type ActivityLogContext,
} from '@/components/molecules/email-button/activity-log-context'
import type { ActivityLogPromptPayload } from '@/components/molecules/email-button/activity-log-prompt-payload'
import {
  EMAIL_BUTTON_DEFAULT_LABEL,
  EMAIL_INVALID_TOOLTIP,
  EMAIL_MISSING_TOOLTIP,
} from '@/components/molecules/email-button/email-button-copy'

type Props = {
  to?: string
  bcc?: string
  subject?: string
  body?: string
  label?: string
  composeClient?: ComposeClient
  activityLogContext?: ActivityLogContext
  onActivityLogPrompt?: (payload: ActivityLogPromptPayload) => void
}

export function EmailButton({
  to = '',
  bcc,
  subject,
  body,
  label = EMAIL_BUTTON_DEFAULT_LABEL,
  composeClient = DEFAULT_COMPOSE_CLIENT,
  activityLogContext,
  onActivityLogPrompt,
}: Props) {
  const [promptOpen, setPromptOpen] = useState(false)
  const promptCleanupRef = useRef<(() => void) | null>(null)
  const trimmedTo = to.trim()
  const trimmedBcc = bcc?.trim() ?? ''
  const recipientsValid = hasValidComposeRecipients({ to: trimmedTo, bcc: trimmedBcc })
  const disabled = !recipientsValid
  const hasRecipientInput = Boolean(trimmedTo || trimmedBcc)
  const scopes = activityLogContext ? activityLogScopesFromContext(activityLogContext) : []

  useEffect(() => () => promptCleanupRef.current?.(), [])

  function handleClick() {
    openEmailCompose(
      buildComposeUrl({ to: trimmedTo, bcc: trimmedBcc || undefined, subject, body }, composeClient),
      composeClient,
    )
    promptCleanupRef.current?.()
    if (scopes.length > 0) {
      promptCleanupRef.current = scheduleActivityLogPrompt(() => {
        const payload = { scopes, defaultContent: subject ?? '' }
        if (onActivityLogPrompt) {
          onActivityLogPrompt(payload)
          return
        }
        setPromptOpen(true)
      })
    }
  }

  const tooltip = !recipientsValid
    ? hasRecipientInput
      ? EMAIL_INVALID_TOOLTIP
      : EMAIL_MISSING_TOOLTIP
    : undefined

  return (
    <>
      <Button type="button" variant="accent" onClick={handleClick} disabled={disabled} title={tooltip}>
        <Mail className="size-4" />
        {label}
      </Button>
      {scopes.length > 0 && promptOpen && !onActivityLogPrompt ? (
        <ActivityLogPromptModal
          open={promptOpen}
          onOpenChange={setPromptOpen}
          defaultContent={subject ?? ''}
          scopes={scopes}
        />
      ) : null}
    </>
  )
}
