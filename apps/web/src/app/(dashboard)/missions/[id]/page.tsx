import { notFound } from 'next/navigation'
import { createServerCaller } from '@/lib/trpc/server'
import { MissionDetailPage } from '@/components/organisms/MissionDetailPage'

type Props = { params: Promise<{ id: string }> }

export default async function Page({ params }: Props) {
  const { id } = await params
  const caller = await createServerCaller()
  const mission = await caller.mission.getById({ id })
  if (!mission) notFound()

  const refs = await caller.mission.referentials()
  const candidateRefs = await caller.candidate.referentials()
  const [documents, activities, contactsByPharmacy] = await Promise.all([
    caller.document.listByEntity({ entityType: 'MISSION', entityId: id }),
    caller.activityLog.listByEntity({ entityType: 'MISSION', entityId: id }),
    Promise.all(
      refs.pharmacies.map(async (pharmacy) => {
        const contacts = await caller.contact.listByPharmacy({ pharmacyId: pharmacy.id })
        return [pharmacy.id, contacts] as const
      }),
    ).then((entries) => Object.fromEntries(entries)),
  ])

  return (
    <MissionDetailPage
      mission={mission}
      pipelineStages={candidateRefs.pipelineStages}
      jobTitles={refs.jobTitles}
      pharmacies={refs.pharmacies}
      recruiters={refs.recruiters}
      contactsByPharmacy={contactsByPharmacy}
      activityCount={activities.length}
      documentCount={documents.length}
    />
  )
}
