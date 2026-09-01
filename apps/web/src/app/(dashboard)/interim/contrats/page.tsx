import { createServerCaller } from '@/lib/trpc/server'
import { BadakanContractList } from '@/components/organisms/BadakanContractList'

export default async function Page() {
  const caller = await createServerCaller()
  const rows = await caller.badakanContract.list()
  return <BadakanContractList rows={rows} />
}
