import { Activity } from 'lucide-react'
import { createServerCaller } from '@/lib/trpc/server'
import { DashboardPage } from '@/components/molecules/DashboardPage'
import { ActivitePage } from '@/components/organisms/ActivitePage'
import { resolveActivitePeriod } from '@/view-models/activite-period'

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

function one(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams
  const period = resolveActivitePeriod({ from: one(params.from), to: one(params.to) })
  const caller = await createServerCaller()
  const overview = await caller.activite.overview({ from: period.fromYmd, to: period.toYmd })
  return (
    <DashboardPage
      icon={<Activity className="size-5" />}
      title="Activité"
      description="Volumes opérationnels sur la période (Direction / RH-Admin)."
      maxWidth="max-w-6xl"
    >
      <ActivitePage overview={overview} />
    </DashboardPage>
  )
}
