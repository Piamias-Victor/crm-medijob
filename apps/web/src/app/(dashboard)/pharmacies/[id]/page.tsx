import { notFound } from 'next/navigation'
import { createServerCaller } from '@/lib/trpc/server'
import { PharmacyDetailPage } from '@/components/organisms/PharmacyDetailPage'
import { parsePharmacyBackHref } from '@/lib/pharmacy-href'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ back?: string }>
}

export default async function Page({ params, searchParams }: Props) {
  const { id } = await params
  const { back } = await searchParams
  const caller = await createServerCaller()
  const [pharmacy, referentials, missionRefs, documents, activities] = await Promise.all([
    caller.pharmacy.getById({ id }),
    caller.pharmacy.referentials(),
    caller.mission.referentials(),
    caller.document.listByEntity({ entityType: 'PHARMACY', entityId: id }),
    caller.activityLog.listByEntity({ entityType: 'PHARMACY', entityId: id }),
  ])

  if (!pharmacy) notFound()

  return (
    <PharmacyDetailPage
      pharmacy={pharmacy}
      groupements={referentials.groupements}
      softwares={referentials.softwares}
      missionRefs={missionRefs}
      documents={documents}
      activities={activities}
      backHref={parsePharmacyBackHref(back)}
    />
  )
}
