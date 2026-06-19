'use client'

import { useState } from 'react'
import type { DocumentListRow } from '@/view-models/document-list'
import type { PharmacyDetailPayload } from '@/view-models/pharmacy-detail.types'
import type { ActivityLogRow } from '@/view-models/activity-log'
import type { PharmacyTab } from '@/view-models/pharmacy-tabs'
import { pharmacyDetailHeaderChips } from '@/view-models/pharmacy-detail-header'
import { usePharmacyDetailMutations } from '@/lib/hooks/use-pharmacy-detail-mutations'
import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { EntityDetailShell } from '@/components/molecules/EntityDetailShell'
import { PharmacyDetailTabs } from '@/components/molecules/PharmacyDetailTabs'
import { PharmacyDetailTabPanel } from '@/components/molecules/PharmacyDetailTabPanel'
import { PharmacyStatusBadge } from '@/components/molecules/PharmacyStatusBadge'

type Ref = { id: string; name: string }
type MissionRefs = { jobTitles: Ref[]; recruiters: Ref[] }

type Props = {
  pharmacy: PharmacyDetailPayload
  groupements: Ref[]
  softwares: Ref[]
  missionRefs: MissionRefs
  documents: DocumentListRow[]
  activities: ActivityLogRow[]
}

export function PharmacyDetailPage({
  pharmacy,
  groupements,
  softwares,
  missionRefs,
  documents,
  activities,
}: Props) {
  const [tab, setTab] = useState<PharmacyTab>('infos')
  const mutations = usePharmacyDetailMutations()

  return (
    <EntityDetailShell
      header={
        <DetailPageHeader
          backHref="/pharmacies"
          backLabel="Pharmacies"
          name={pharmacy.name}
          city={pharmacy.city ?? undefined}
          chips={pharmacyDetailHeaderChips(pharmacy)}
        />
      }
      meta={
        <div className="flex flex-wrap items-center gap-2 px-1">
          <PharmacyStatusBadge status={pharmacy.status} />
          {pharmacy.softwareName ? (
            <span className="text-xs text-fg-muted">LGO · {pharmacy.softwareName}</span>
          ) : null}
        </div>
      }
      tabs={
        <PharmacyDetailTabs
          active={tab}
          onChange={setTab}
          contactCount={pharmacy.contacts.length}
          missionCount={pharmacy.activeMissions.length}
        />
      }
      tabKey={tab}
    >
      <PharmacyDetailTabPanel
        tab={tab}
        pharmacy={pharmacy}
        groupements={groupements}
        softwares={softwares}
        missionRefs={missionRefs}
        documents={documents}
        submittingInfo={mutations.update.isPending}
        submittingMission={mutations.createMission.isPending}
        onUpdate={(data) => mutations.update.mutate({ id: pharmacy.id, data })}
        onCreateMission={(data) => mutations.createMission.mutate(data)}
        onCreateJobTitle={(name) => mutations.createJobTitle.mutateAsync({ name })}
        onSearchSiret={mutations.searchSiret}
        onCreateGroupement={(name) => mutations.newGroupement.mutateAsync({ name })}
        onCreateSoftware={(name) => mutations.newSoftware.mutateAsync({ name })}
        activities={activities}
      />
    </EntityDetailShell>
  )
}
