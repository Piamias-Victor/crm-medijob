import { createServerCaller } from '@/lib/trpc/server'
import { IntakeStatusAdmin } from '@/components/organisms/IntakeStatusAdmin'

export default async function AdminIntakeStatusPage() {
  const caller = await createServerCaller()
  const items = await caller.admin.intakeStatus.list()
  return <IntakeStatusAdmin items={items} />
}
