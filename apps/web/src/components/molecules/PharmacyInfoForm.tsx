'use client'

import type { PharmacyDetailPayload } from '@/view-models/pharmacy-detail.types'
import type { PharmacyInput } from '@/view-models/pharmacy-form.schema'
import { toPharmacyFormValues } from '@/view-models/pharmacy-form'
import { PharmacyForm } from '@/components/molecules/PharmacyForm'

type Ref = { id: string; name: string }

type Props = {
  pharmacy: PharmacyDetailPayload
  groupements: Ref[]
  softwares: Ref[]
  submitting: boolean
  errorMessage?: string | null
  onSubmit: (data: PharmacyInput) => void
  onSearchSiret: (query: string) => Promise<{ siret: string; name: string; address: string; city: string; postalCode: string }[]>
  onCreateGroupement: (name: string) => Promise<Ref>
  onCreateSoftware: (name: string) => Promise<Ref>
}

export function PharmacyInfoForm(props: Props) {
  const { pharmacy } = props
  return (
    <PharmacyForm
      key={pharmacy.id + pharmacy.updatedAt.toISOString()}
      defaultValues={toPharmacyFormValues(pharmacy.formSource)}
      groupements={props.groupements}
      softwares={props.softwares}
      submitting={props.submitting}
      errorMessage={props.errorMessage}
      onSubmit={props.onSubmit}
      onSearchSiret={props.onSearchSiret}
      onCreateGroupement={props.onCreateGroupement}
      onCreateSoftware={props.onCreateSoftware}
    />
  )
}
