'use client'

import { useRouter } from 'next/navigation'
import { Construction } from 'lucide-react'
import type { PharmacyDetailPayload } from '@/view-models/pharmacy-detail.types'
import type { PharmacyTab } from '@/view-models/pharmacy-tabs'
import type { PharmacyInput } from '@/view-models/pharmacy-form.schema'
import type { MissionQuickCreateInput } from '@/view-models/mission-quick-create.schema'
import { PHARMACY_TAB_META } from '@/view-models/pharmacy-tab-meta'
import { Button } from '@/components/atoms/Button'
import { EmptyState } from '@/components/atoms/EmptyState'
import { SectionCard } from '@/components/molecules/SectionCard'
import { PharmacyInfoForm } from '@/components/molecules/PharmacyInfoForm'
import { PharmacyContactsTab } from '@/components/molecules/PharmacyContactsTab'
import { PharmacyBesoinsTab } from '@/components/molecules/PharmacyBesoinsTab'

type Ref = { id: string; name: string }
type MissionRefs = { jobTitles: Ref[]; recruiters: Ref[] }

type Props = {
  tab: PharmacyTab
  pharmacy: PharmacyDetailPayload
  groupements: Ref[]
  softwares: Ref[]
  missionRefs: MissionRefs
  submittingInfo: boolean
  submittingMission: boolean
  onUpdate: (data: PharmacyInput) => void
  onCreateMission: (data: MissionQuickCreateInput) => void
  onCreateJobTitle: (name: string) => Promise<Ref>
  onSearchSiret: (query: string) => Promise<{ siret: string; name: string; address: string; city: string; postalCode: string }[]>
  onCreateGroupement: (name: string) => Promise<Ref>
  onCreateSoftware: (name: string) => Promise<Ref>
}

export function PharmacyDetailTabPanel(props: Props) {
  const router = useRouter()
  const meta = PHARMACY_TAB_META[props.tab]

  return (
    <SectionCard
      variant="glass"
      title={meta.title}
      description={meta.description}
      bodyClassName="p-5 sm:p-6"
      actions={
        props.tab === 'contacts' ? (
          <Button variant="ghost" onClick={() => router.push('/contacts')}>
            Voir tous les contacts
          </Button>
        ) : null
      }
    >
      {props.tab === 'infos' ? (
        <PharmacyInfoForm
          pharmacy={props.pharmacy}
          groupements={props.groupements}
          softwares={props.softwares}
          submitting={props.submittingInfo}
          onSubmit={props.onUpdate}
          onSearchSiret={props.onSearchSiret}
          onCreateGroupement={props.onCreateGroupement}
          onCreateSoftware={props.onCreateSoftware}
        />
      ) : null}
      {props.tab === 'contacts' ? (
        <PharmacyContactsTab
          pharmacyId={props.pharmacy.id}
          pharmacyName={props.pharmacy.name}
          contacts={props.pharmacy.contacts}
        />
      ) : null}
      {props.tab === 'besoins' ? (
        <PharmacyBesoinsTab
          pharmacyId={props.pharmacy.id}
          missions={props.pharmacy.activeMissions}
          jobTitles={props.missionRefs.jobTitles}
          recruiters={props.missionRefs.recruiters}
          submitting={props.submittingMission}
          onCreate={props.onCreateMission}
          onCreateJobTitle={props.onCreateJobTitle}
        />
      ) : null}
      {props.tab === 'historique' ? (
        <EmptyState icon={Construction} title="Bientôt disponible" description="ActivityLog pharmacie — issue #63." />
      ) : null}
      {props.tab === 'documents' ? (
        <EmptyState icon={Construction} title="Bientôt disponible" description="Documents Blob — issue #61." />
      ) : null}
    </SectionCard>
  )
}
