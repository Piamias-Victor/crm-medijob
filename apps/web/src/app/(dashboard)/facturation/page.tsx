import { createServerCaller } from '@/lib/trpc/server'
import { FacturationOverviewPage } from '@/components/organisms/FacturationOverviewPage'

export default async function Page() {
  const caller = await createServerCaller()
  const overview = await caller.facturation.overview()
  return <FacturationOverviewPage overview={overview} />
}
