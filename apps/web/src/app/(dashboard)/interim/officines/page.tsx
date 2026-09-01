import { createServerCaller } from '@/lib/trpc/server'
import { BadakanEnterpriseList } from '@/components/organisms/BadakanEnterpriseList'

export default async function Page() {
  const caller = await createServerCaller()
  const rows = await caller.badakanEnterprise.listPending()
  return <BadakanEnterpriseList rows={rows} />
}
