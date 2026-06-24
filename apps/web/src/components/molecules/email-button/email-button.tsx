'use client'

import { useEffect, useRef, useState } from 'react'
import { Mail } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { buildComposeUrl } from '@/lib/mailto/build-compose-url'
import { DEFAULT_COMPOSE_CLIENT, type ComposeClient } from '@/lib/mailto/compose-client'
import { isValidEmailRecipient } from '@/lib/mailto/is-valid-email-recipient'
import { openEmailCompose } from '@/lib/mailto/open-email-compose'
import { scheduleActivityLogPrompt } from '@/lib/mailto/schedule-activity-log-prompt'
import { useToastStore } from '@/stores/toast-store'
import { ActivityLogPromptModal } from '@/components/molecules/email-button/activity-log-prompt-modal'
import {
  activityLogScopesFromContext,
  type ActivityLogContext,
} from '@/components/molecules/email-button/activity-log-context'
import {
  COMPOSE_POPUP_BLOCKED,
  EMAIL_BUTTON_DEFAULT_LABEL,
  EMAIL_INVALID_TOOLTIP,
  EMAIL_MISSING_TOOLTIP,
} from '@/components/molecules/email-button/email-button-copy'

type Props = {
  to: string
  subject?: string
  body?: string
  label?: string
  composeClient?: ComposeClient
  activityLogContext?: ActivityLogContext
}

export function EmailButton({
  to,
  subject,
  body,
  label = EMAIL_BUTTON_DEFAULT_LABEL,
  composeClient = DEFAULT_COMPOSE_CLIENT,
  activityLogContext,
}: Props) {
  const push = useToastStore((state) => state.push)
  const [promptOpen, setPromptOpen] = useState(false)
  const promptCleanupRef = useRef<(() => void) | null>(null)
  const trimmedTo = to.trim()
  const missing = !trimmedTo
  const invalid = !missing && !isValidEmailRecipient(trimmedTo)
  const disabled = missing || invalid
  const scopes = activityLogContext ? activityLogScopesFromContext(activityLogContext) : []

  useEffect(() => () => promptCleanupRef.current?.(), [])

  function handleClick() {
    const opened = openEmailCompose(buildComposeUrl({ to: trimmedTo, subject, body }, composeClient), composeClient)
    if (!opened) {
      push({ variant: 'error', message: COMPOSE_POPUP_BLOCKED })
      return
    }
    promptCleanupRef.current?.()
    if (scopes.length > 0) {
      promptCleanupRef.current = scheduleActivityLogPrompt(() => setPromptOpen(true))
    }
  }

  const tooltip = missing ? EMAIL_MISSING_TOOLTIP : invalid ? EMAIL_INVALID_TOOLTIP : undefined

  return (
    <>
      <Button type="button" variant="accent" onClick={handleClick} disabled={disabled} title={tooltip}>
        <Mail className="size-4" />
        {label}
      </Button>
      {scopes.length > 0 && promptOpen ? (
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
