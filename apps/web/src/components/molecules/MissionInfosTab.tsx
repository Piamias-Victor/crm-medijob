'use client'

import type { MissionDetailPayload } from '@/view-models/mission-detail.types'
import type { MissionFormValues } from '@/view-models/mission-form.schema'
import { MissionInfoForm } from '@/components/molecules/MissionInfoForm'
import { MissionStatusActions } from '@/components/molecules/MissionStatusActions'

type Ref = { id: string; name: string }
type ContactRef = { id: string; label: string }

type Props = {
  mission: MissionDetailPayload
  jobTitles: Ref[]
  pharmacies: Ref[]
  recruiters: Ref[]
  contactsByPharmacy: Record<string, ContactRef[]>
  submitting: boolean
  onUpdate: (data: MissionFormValues) => void
  onCreateJobTitle: (name: string) => Promise<Ref>
  onPharmacyChange: () => void
}

export function MissionInfosTab(props: Props) {
  return (
    <div className="flex flex-col gap-5">
      <MissionInfoForm
        mission={props.mission}
        jobTitles={props.jobTitles}
        pharmacies={props.pharmacies}
        recruiters={props.recruiters}
        contactsByPharmacy={props.contactsByPharmacy}
        submitting={props.submitting}
        onSubmit={props.onUpdate}
        onCreateJobTitle={props.onCreateJobTitle}
        onPharmacyChange={props.onPharmacyChange}
      />
      <MissionStatusActions mission={props.mission} />
    </div>
  )
}
