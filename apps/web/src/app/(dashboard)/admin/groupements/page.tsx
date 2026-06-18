import { createServerCaller } from '@/lib/trpc/server'
import { GroupementAdmin } from '@/components/organisms/GroupementAdmin'

export default async function AdminGroupementsPage() {
  const caller = await createServerCaller()
  const items = await caller.admin.groupement.list()
  return <GroupementAdmin items={items} />
}
