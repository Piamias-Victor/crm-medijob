import { createServerCaller } from '@/lib/trpc/server'
import { SoftwareAdmin } from '@/components/organisms/SoftwareAdmin'

export default async function AdminSoftwarePage() {
  const caller = await createServerCaller()
  const items = await caller.admin.software.list()
  return <SoftwareAdmin items={items} />
}
