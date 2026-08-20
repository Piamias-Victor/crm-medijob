'use client'

import type { ContractType } from '@prisma/client'
import type { DevisView } from '@/view-models/devis'
import { toDevisFormValues } from '@/view-models/devis-form'
import { DevisDraftForm } from '@/components/molecules/DevisDraftForm'
import { MissionMargeForm } from '@/components/molecules/MissionMargeForm'
import { useDevisDraftMutation } from '@/lib/hooks/use-devis-draft-mutation'
import { useMissionMargeMutation } from '@/lib/hooks/use-mission-marge-mutation'

type Props = {
  missionId: string
  contractType: ContractType
  heuresParSemaine: number | null
  marge: number | null
  devis: DevisView | null
}

export function MissionDevisTab({ missionId, contractType, heuresParSemaine, marge, devis }: Props) {
  const save = useDevisDraftMutation()
  const saveMarge = useMissionMargeMutation()
  const values = toDevisFormValues(devis, { contractType, hours: heuresParSemaine })

  return (
    <div className="flex flex-col gap-8">
      <DevisDraftForm
        values={values}
        submitting={save.isPending}
        onSubmit={(data) => save.mutate({ missionId, ...data })}
      />
      <MissionMargeForm
        marge={marge}
        submitting={saveMarge.isPending}
        onSubmit={(next) => saveMarge.mutate({ id: missionId, marge: next })}
      />
    </div>
  )
}
