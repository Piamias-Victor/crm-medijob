'use client'

import type { ContractType } from '@prisma/client'
import type { DevisMissionView } from '@/view-models/devis'
import type { DevisFormValues } from '@/view-models/devis-form'
import { toDevisFormValues } from '@/view-models/devis-form'
import type { MissionQuoteState } from '@/view-models/mission-quote-state'
import { DevisCurrentCard } from '@/components/molecules/DevisCurrentCard'
import { openDevisSendResult } from '@/lib/finance/open-devis-send-result'

type SendResult = { document: { id: string }; composeUrl: string }

type Props = {
  missionId: string
  contractType: ContractType
  heuresParSemaine: number | null
  devis: DevisMissionView
  quote: MissionQuoteState
  previewing: boolean
  sending: boolean
  accepting: boolean
  onPreview: (values: DevisFormValues) => void
  onSend: (input: { missionId: string }, opts: { onSuccess: (result: SendResult) => void }) => void
  onAccept: (input: { missionId: string }) => void
}

export function DevisCurrentSection({
  missionId,
  contractType,
  heuresParSemaine,
  devis,
  quote,
  previewing,
  sending,
  accepting,
  onPreview,
  onSend,
  onAccept,
}: Props) {
  const currentValues = toDevisFormValues(devis.current, {
    contractType,
    hours: heuresParSemaine,
  })
  return (
    <DevisCurrentCard
      current={devis.current}
      commercialStatus={quote.commercialStatus}
      ca={quote.ca}
      previewing={previewing}
      sending={sending}
      accepting={accepting}
      onPreview={devis.current ? () => onPreview(currentValues) : undefined}
      onSend={quote.canSend ? () => onSend({ missionId }, { onSuccess: openDevisSendResult }) : undefined}
      onAccept={quote.canAccept ? () => onAccept({ missionId }) : undefined}
    />
  )
}
