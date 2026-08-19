'use client'

import type { ContractType } from '@prisma/client'
import type { DevisView } from '@/view-models/devis'
import { toDevisFormValues } from '@/view-models/devis-form'
import { DevisDraftForm } from '@/components/molecules/DevisDraftForm'
import { useDevisDraftMutation } from '@/lib/hooks/use-devis-draft-mutation'

type Props = {
  missionId: string
  contractType: ContractType
  heuresParSemaine: number | null
  devis: DevisView | null
}

export function MissionDevisTab({ missionId, contractType, heuresParSemaine, devis }: Props) {
  const save = useDevisDraftMutation()
  const values = toDevisFormValues(devis, { contractType, hours: heuresParSemaine })

  return (
    <DevisDraftForm
      values={values}
      submitting={save.isPending}
      onSubmit={(data) => save.mutate({ missionId, ...data })}
    />
  )
}
