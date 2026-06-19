'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, MapPin } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import type { MissionDetailPayload } from '@/view-models/mission-detail.types'
import type { MissionTab } from '@/view-models/mission-tabs'
import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { EntityDetailShell } from '@/components/molecules/EntityDetailShell'
import { MissionDetailTabs } from '@/components/molecules/MissionDetailTabs'
import { MissionDetailTabPanel } from '@/components/molecules/MissionDetailTabPanel'
import { MissionStatusBadge } from '@/components/molecules/MissionStatusBadge'

type Ref = { id: string; name: string }

type Props = {
  mission: MissionDetailPayload
  jobTitles: Ref[]
  pharmacies: Ref[]
  recruiters: Ref[]
}

export function MissionDetailPage({ mission, jobTitles, pharmacies, recruiters }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<MissionTab>('infos')
  const mutation = useEntityMutation({
    onSuccess: () => router.refresh(),
    successMessage: 'Mission enregistrée',
  })
  const refMutation = useEntityMutation()
  const update = trpc.mission.update.useMutation(mutation)
  const createJobTitle = trpc.mission.createJobTitle.useMutation(refMutation)

  return (
    <EntityDetailShell
      header={
        <DetailPageHeader
          backHref="/missions"
          backLabel="Missions"
          name={mission.formSource.title}
          jobTitle={mission.jobTitleName}
          city={mission.city ?? undefined}
          referentName={mission.referentName}
          chips={[
            { icon: Building2, label: mission.pharmacyName },
            ...(mission.city ? [{ icon: MapPin, label: mission.city }] : []),
          ]}
        />
      }
      meta={
        <div className="px-1">
          <MissionStatusBadge status={mission.status} />
        </div>
      }
      tabs={<MissionDetailTabs active={tab} onChange={setTab} />}
      tabKey={tab}
    >
      <MissionDetailTabPanel
        tab={tab}
        mission={mission}
        jobTitles={jobTitles}
        pharmacies={pharmacies}
        recruiters={recruiters}
        submitting={update.isPending}
        onUpdate={(data) => update.mutate({ id: mission.id, data })}
        onCreateJobTitle={(name) => createJobTitle.mutateAsync({ name })}
      />
    </EntityDetailShell>
  )
}
