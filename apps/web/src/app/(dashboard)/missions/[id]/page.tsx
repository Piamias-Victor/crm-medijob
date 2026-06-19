import { notFound } from 'next/navigation'
import { createServerCaller } from '@/lib/trpc/server'
import { MissionDetailPage } from '@/components/organisms/MissionDetailPage'

type Props = { params: Promise<{ id: string }> }

export default async function Page({ params }: Props) {
  const { id } = await params
  const caller = await createServerCaller()
  const [mission, refs, documents, activities] = await Promise.all([
    caller.mission.getById({ id }),
    caller.mission.referentials(),
    caller.document.listByEntity({ entityType: 'MISSION', entityId: id }),
    caller.activityLog.listByEntity({ entityType: 'MISSION', entityId: id }),
  ])

  if (!mission) notFound()

  return (
    <MissionDetailPage
      mission={mission}
      jobTitles={refs.jobTitles}
      pharmacies={refs.pharmacies}
      recruiters={refs.recruiters}
      activityCount={activities.length}
      documentCount={documents.length}
    />
  )
}
