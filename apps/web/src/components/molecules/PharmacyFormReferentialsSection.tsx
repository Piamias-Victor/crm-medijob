'use client'

import { PharmacySelects } from '@/components/molecules/PharmacySelects'
import { toSelectOptions } from '@/lib/form-options'
import type { PharmacyInput } from '@/view-models/pharmacy-form.schema'

type Ref = { id: string; name: string }

type Props = {
  status: PharmacyInput['status']
  groupementId?: string
  softwareId?: string
  groupements: Ref[]
  softwares: Ref[]
  onStatus: (value: PharmacyInput['status']) => void
  onGroupement: (value: string) => void
  onSoftware: (value: string) => void
  onCreateGroupement: (name: string) => Promise<{ value: string; label: string }>
  onCreateSoftware: (name: string) => Promise<{ value: string; label: string }>
}

export function PharmacyFormReferentialsSection(props: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <PharmacySelects
        status={props.status ?? 'PROSPECT'}
        onStatus={(value) => props.onStatus(value as PharmacyInput['status'])}
        groupementId={props.groupementId}
        onGroupement={props.onGroupement}
        groupements={toSelectOptions(props.groupements)}
        onCreateGroupement={props.onCreateGroupement}
        softwareId={props.softwareId}
        onSoftware={props.onSoftware}
        softwares={toSelectOptions(props.softwares)}
        onCreateSoftware={props.onCreateSoftware}
      />
    </div>
  )
}
