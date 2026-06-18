import { createServerCaller } from '@/lib/trpc/server'
import { UsersAdmin } from '@/components/organisms/UsersAdmin'

export default async function AdminUsersPage() {
  const caller = await createServerCaller()
  const users = await caller.admin.user.list()
  return <UsersAdmin users={users} />
}
