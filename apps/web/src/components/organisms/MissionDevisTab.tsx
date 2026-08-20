'use client'

import type { ContractType } from '@prisma/client'
import type { DevisMissionView } from '@/view-models/devis'
import type { DevisFormValues } from '@/view-models/devis-form'
import { toDevisFormValues } from '@/view-models/devis-form'
import { DevisDraftForm } from '@/components/molecules/DevisDraftForm'
import { DevisCurrentCard } from '@/components/molecules/DevisCurrentCard'
import { MissionMargeForm } from '@/components/molecules/MissionMargeForm'
import { useDevisDraftMutation } from '@/lib/hooks/use-devis-draft-mutation'
import { useDevisSendMutation } from '@/lib/hooks/use-devis-send-mutation'
import { openDevisSendResult } from '@/lib/finance/open-devis-send-result'
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
  const remove = useDevisDeleteDraftMutation()
  const saveMarge = useMissionMargeMutation()
  const values = toDevisFormValues(devis.draft, { contractType, hours: heuresParSemaine })

  async function persistThenSend(data: DevisFormValues) {
    await save.mutateAsync({ missionId, ...data })
    openDevisSendResult(await send.mutateAsync({ missionId }))
  }

  return (
    <div className="flex flex-col gap-8">
      <DevisCurrentCard current={devis.current} />
      <DevisDraftForm
        values={values}
        submitting={save.isPending}
        sending={send.isPending}
        deleting={remove.isPending}
        hasDraft={devis.draft !== null}
        onSubmit={(data) => save.mutate({ missionId, ...data })}
        onSend={persistThenSend}
        onDelete={() => remove.mutate({ missionId })}
      />
      <MissionMargeForm
        marge={marge}
        submitting={saveMarge.isPending}
        onSubmit={(next) => saveMarge.mutate({ id: missionId, marge: next })}
      />
    </div>
  )
}
