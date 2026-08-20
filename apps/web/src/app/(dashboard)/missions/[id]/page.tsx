import { notFound } from 'next/navigation'
import { createServerCaller } from '@/lib/trpc/server'
import { MissionDetailPage } from '@/components/organisms/MissionDetailPage'
import { parseMissionTab } from '@/view-models/mission-tab-parse'
import { toMissionQuoteState } from '@/view-models/mission-quote-state'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Page({ params, searchParams }: Props) {
  const { id } = await params
  const query = await searchParams
  const tab = typeof query.tab === 'string' ? query.tab : undefined
  const caller = await createServerCaller()
  const mission = await caller.mission.getById({ id })
  if (!mission) notFound()

  const refs = await caller.mission.referentials()
  const candidateRefs = await caller.candidate.referentials()
  const [documents, activities, contactsByPharmacy, devis] = await Promise.all([
    caller.document.listByEntity({ entityType: 'MISSION', entityId: id }),
    caller.activityLog.listByEntity({ entityType: 'MISSION', entityId: id }),
    caller.contact.listByPharmacyIds({ pharmacyIds: refs.pharmacies.map((pharmacy) => pharmacy.id) }),
    caller.devis.getByMission({ missionId: id }),
  ])

  return (
    <MissionDetailPage
      mission={mission}
      pipelineStages={candidateRefs.pipelineStages}
      jobTitles={refs.jobTitles}
      pharmacies={refs.pharmacies}
      recruiters={refs.recruiters}
      contactsByPharmacy={contactsByPharmacy}
      activities={activities}
      documents={documents}
      devis={devis}
      quote={toMissionQuoteState(mission.status, devis.current)}
      activityCount={activities.length}
      documentCount={documents.length}
      initialTab={parseMissionTab(tab)}
    />
  )
}
