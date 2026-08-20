'use client'

import type { ContractType } from '@prisma/client'
import type { DevisMissionView } from '@/view-models/devis'
import { toDevisFormValues } from '@/view-models/devis-form'
import { DevisDraftForm } from '@/components/molecules/DevisDraftForm'
import { DevisCurrentCard } from '@/components/molecules/DevisCurrentCard'
import { DevisPreviewModal } from '@/components/molecules/DevisPreviewModal'
import { MissionMargeForm } from '@/components/molecules/MissionMargeForm'
import { useDevisDraftMutation } from '@/lib/hooks/use-devis-draft-mutation'
import { useDevisSendMutation } from '@/lib/hooks/use-devis-send-mutation'
import { useDevisPreviewMutation } from '@/lib/hooks/use-devis-preview-mutation'
import { useDevisPreviewFlow } from '@/lib/hooks/use-devis-preview-flow'
import { useDevisDeleteDraftMutation } from '@/lib/hooks/use-devis-delete-draft-mutation'
import { useMissionMargeMutation } from '@/lib/hooks/use-mission-marge-mutation'

type Props = {
  missionId: string
  contractType: ContractType
  heuresParSemaine: number | null
  marge: number | null
  devis: DevisMissionView
}

export function MissionDevisTab({ missionId, contractType, heuresParSemaine, marge, devis }: Props) {
  const save = useDevisDraftMutation()
  const send = useDevisSendMutation()
  const previewPdf = useDevisPreviewMutation()
  const remove = useDevisDeleteDraftMutation()
  const saveMarge = useMissionMargeMutation()
  const flow = useDevisPreviewFlow(missionId, save, send, previewPdf)
  const values = toDevisFormValues(devis.draft, { contractType, hours: heuresParSemaine })

  return (
    <div className="flex flex-col gap-8">
      <DevisCurrentCard current={devis.current} />
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
