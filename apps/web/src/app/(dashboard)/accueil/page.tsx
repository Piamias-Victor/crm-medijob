import { createServerCaller } from '@/lib/trpc/server'
import { HomePage } from '@/components/organisms/HomePage'

export default async function Page() {
  const caller = await createServerCaller()
  const overview = await caller.dashboard.overview()

  return <HomePage overview={overview} />
}
