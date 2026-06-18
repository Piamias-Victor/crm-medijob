import { notFound } from 'next/navigation'
import { createServerCaller } from '@/lib/trpc/server'
import { PharmacyDetailPage } from '@/components/organisms/PharmacyDetailPage'

type Props = { params: Promise<{ id: string }> }

export default async function Page({ params }: Props) {
  const { id } = await params
  const caller = await createServerCaller()
  const [pharmacy, referentials, missionRefs] = await Promise.all([
    caller.pharmacy.getById({ id }),
    caller.pharmacy.referentials(),
    caller.mission.referentials(),
  ])

  if (!pharmacy) notFound()

  return (
    <PharmacyDetailPage
      pharmacy={pharmacy}
      groupements={referentials.groupements}
      softwares={referentials.softwares}
      missionRefs={missionRefs}
    />
  )
}
