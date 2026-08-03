'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { openEmailCompose } from '@/lib/mailto/open-email-compose'
import { scheduleActivityLogPrompt } from '@/lib/mailto/schedule-activity-log-prompt'
import { openDeepLinks } from '@/lib/phone/open-deep-links'
import { ActivityLogPromptModal } from '@/components/molecules/email-button/activity-log-prompt-modal'
import { MissionMatchingContactBar } from '@/components/molecules/MissionMatchingContactBar'
import {
  resolveMatchingContactActions,
  type MatchingContactCandidate,
} from '@/view-models/matching-contact-actions'
import { matchingContactScopes } from '@/view-models/matching-contact-scopes'

type Props = {
  missionId: string
  subject: string
  selected: MatchingContactCandidate[]
  onClear: () => void
}

export function MissionMatchingContactPanel({ missionId, subject, selected, onClear }: Props) {
  const [promptOpen, setPromptOpen] = useState(false)
  const cleanupRef = useRef<(() => void) | null>(null)
  const actions = useMemo(
    () => resolveMatchingContactActions({ selected, subject }),
    [selected, subject],
  )
  const scopes = useMemo(
    () => matchingContactScopes(
      missionId,
      selected.map((row) => row.candidateId),
    ),
    [missionId, selected],
  )

  useEffect(() => () => cleanupRef.current?.(), [])

  function handleEmail() {
    if (!actions.mailtoUrl) return
    openEmailCompose(actions.mailtoUrl, 'gmail')
    cleanupRef.current?.()
    cleanupRef.current = scheduleActivityLogPrompt(() => setPromptOpen(true))
  }

  return (
    <>
      <MissionMatchingContactBar
        selectedCount={selected.length}
        emailEnabled={Boolean(actions.mailtoUrl)}
        smsEnabled={actions.smsUrls.length > 0}
        whatsappEnabled={actions.whatsappUrls.length > 0}
        onEmail={handleEmail}
        onSms={() => openDeepLinks(actions.smsUrls)}
        onWhatsApp={() => openDeepLinks(actions.whatsappUrls)}
        onClear={onClear}
      />
      <ActivityLogPromptModal
        open={promptOpen}
        onOpenChange={setPromptOpen}
        defaultContent={subject}
        scopes={scopes}
      />
    </>
  )
}
