import { createServerCaller } from '@/lib/trpc/server'
import { PharmaciesPage } from '@/components/organisms/PharmaciesPage'

export default async function Page() {
  const caller = await createServerCaller()
  const rows = await caller.pharmacy.list()

  return <PharmaciesPage rows={rows} />
}
