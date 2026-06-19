import { notFound } from 'next/navigation'
import { createServerCaller } from '@/lib/trpc/server'
import { PharmacyDetailPage } from '@/components/organisms/PharmacyDetailPage'

type Props = { params: Promise<{ id: string }> }

export default async function Page({ params }: Props) {
  const { id } = await params
  const caller = await createServerCaller()
  const [pharmacy, referentials, missionRefs, activities] = await Promise.all([
    caller.pharmacy.getById({ id }),
    caller.pharmacy.referentials(),
    caller.mission.referentials(),
    caller.activityLog.list({ pharmacyId: id }),
  ])

  if (!pharmacy) notFound()

  return (
    <PharmacyDetailPage
      pharmacy={pharmacy}
      groupements={referentials.groupements}
      softwares={referentials.softwares}
      missionRefs={missionRefs}
      activities={activities}
    />
  )
}
