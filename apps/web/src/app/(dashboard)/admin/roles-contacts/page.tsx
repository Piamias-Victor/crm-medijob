import { createServerCaller } from '@/lib/trpc/server'
import { ContactRoleAdmin } from '@/components/organisms/ContactRoleAdmin'

export default async function AdminContactRolesPage() {
  const caller = await createServerCaller()
  const items = await caller.admin.contactRole.list()
  return <ContactRoleAdmin items={items} />
}
