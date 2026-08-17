import { redirect } from 'next/navigation'
import { auth } from '@/server/auth'
import { createServerCaller } from '@/lib/trpc/server'
import { HomePage } from '@/components/organisms/HomePage'

export default async function Page() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const caller = await createServerCaller()
  const overview = await caller.dashboard.overview()

  return <HomePage overview={overview} />
}
