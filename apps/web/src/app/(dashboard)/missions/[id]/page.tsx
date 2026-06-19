import { notFound } from 'next/navigation'
import { createServerCaller } from '@/lib/trpc/server'
import { MissionDetailPage } from '@/components/organisms/MissionDetailPage'

type Props = { params: Promise<{ id: string }> }

export default async function Page({ params }: Props) {
  const { id } = await params
  const caller = await createServerCaller()
  const [mission, refs] = await Promise.all([
    caller.mission.getById({ id }),
    caller.mission.referentials(),
  ])

  if (!mission) notFound()

  return (
    <MissionDetailPage
      mission={mission}
      jobTitles={refs.jobTitles}
      pharmacies={refs.pharmacies}
      recruiters={refs.recruiters}
    />
  )
}
