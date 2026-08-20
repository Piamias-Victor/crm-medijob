'use client'

import type { ContractType } from '@prisma/client'
import type { DevisMissionView } from '@/view-models/devis'
import { toDevisFormValues } from '@/view-models/devis-form'
import type { MissionQuoteState } from '@/view-models/mission-quote-state'
import { DevisDraftForm } from '@/components/molecules/DevisDraftForm'
import { DevisCurrentSection } from '@/components/molecules/DevisCurrentSection'
import { DevisInvoiceForm } from '@/components/molecules/DevisInvoiceForm'
import { DevisPreviewModal } from '@/components/molecules/DevisPreviewModal'
import { MissionMargeForm } from '@/components/molecules/MissionMargeForm'
import { useDevisDraftMutation } from '@/lib/hooks/use-devis-draft-mutation'
import { useDevisSendMutation } from '@/lib/hooks/use-devis-send-mutation'
import { useDevisPreviewMutation } from '@/lib/hooks/use-devis-preview-mutation'
import { useDevisPreviewFlow } from '@/lib/hooks/use-devis-preview-flow'
import { useDevisDeleteDraftMutation } from '@/lib/hooks/use-devis-delete-draft-mutation'
import { useDevisAcceptMutation } from '@/lib/hooks/use-devis-accept-mutation'
import { useDevisInvoiceMutation } from '@/lib/hooks/use-devis-invoice-mutation'
import { useMissionMargeMutation } from '@/lib/hooks/use-mission-marge-mutation'

type Props = {
  missionId: string
  contractType: ContractType
  heuresParSemaine: number | null
  marge: number | null
  devis: DevisMissionView
  quote: MissionQuoteState
}

export function MissionDevisTab({
  missionId,
  contractType,
  heuresParSemaine,
  marge,
  devis,
  quote,
}: Props) {
  const save = useDevisDraftMutation()
  const send = useDevisSendMutation()
  const previewPdf = useDevisPreviewMutation()
  const remove = useDevisDeleteDraftMutation()
  const accept = useDevisAcceptMutation()
  const invoice = useDevisInvoiceMutation()
  const saveMarge = useMissionMargeMutation()
  const flow = useDevisPreviewFlow(missionId, save, send, previewPdf)
  const values = toDevisFormValues(devis.draft, { contractType, hours: heuresParSemaine })

  return (
    <div className="flex flex-col gap-8">
      <DevisCurrentSection
        missionId={missionId}
        contractType={contractType}
        heuresParSemaine={heuresParSemaine}
        devis={devis}
        quote={quote}
        previewing={previewPdf.isPending}
        sending={send.isPending}
        accepting={accept.isPending}
        onPreview={flow.openPreview}
        onSend={(input, opts) => send.mutate(input, opts)}
        onAccept={(input) => accept.mutate(input)}
      />
      {quote.canInvoice ? (
        <DevisInvoiceForm
          invoicedAt={devis.current?.invoicedAt ?? null}
          submitting={invoice.isPending}
          onSubmit={(invoicedAt) => invoice.mutate({ missionId, invoicedAt })}
        />
      ) : null}
      <DevisDraftForm
        values={values}
        submitting={save.isPending}
        previewing={previewPdf.isPending}
        deleting={remove.isPending}
        hasDraft={devis.draft !== null}
        onSubmit={(data) => save.mutate({ missionId, ...data })}
        onPreview={flow.openPreview}
        onDelete={() => remove.mutate({ missionId })}
      />
      {flow.preview ? (
        <DevisPreviewModal
          open
          quote={flow.preview.quote}
          saving={save.isPending}
          sending={send.isPending}
          onClose={flow.closePreview}
          onSave={flow.saveFromPreview}
          onSend={flow.sendFromPreview}
        />
      ) : null}
      <MissionMargeForm
        marge={marge}
        submitting={saveMarge.isPending}
        onSubmit={(next) => saveMarge.mutate({ id: missionId, marge: next })}
      />
    </div>
  )
}
