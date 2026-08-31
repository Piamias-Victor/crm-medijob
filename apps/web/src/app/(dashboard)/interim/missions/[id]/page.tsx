import { notFound } from 'next/navigation'
import { createServerCaller } from '@/lib/trpc/server'
import { BadakanMissionDetailPage } from '@/components/organisms/badakan-mission-detail-page/BadakanMissionDetailPage'

type Props = { params: Promise<{ id: string }> }

export default async function Page({ params }: Props) {
  const { id } = await params
  const caller = await createServerCaller()
  const detail = await caller.badakanMission.getById({ id })
  if (!detail) notFound()
  return <BadakanMissionDetailPage detail={detail} />
}
