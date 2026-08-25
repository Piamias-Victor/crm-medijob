import { createServerCaller } from '@/lib/trpc/server'
import { ObjectifAdmin } from '@/components/organisms/ObjectifAdmin'

export default async function AdminObjectifsPage() {
  const caller = await createServerCaller()
  const objectif = await caller.admin.objectif.get()
  return <ObjectifAdmin objectif={objectif} />
}
