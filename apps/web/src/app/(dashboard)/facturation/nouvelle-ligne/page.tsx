import { createServerCaller } from '@/lib/trpc/server'
import { FinanceLineForm } from '@/components/organisms/FinanceLineForm'

export default async function Page() {
  const caller = await createServerCaller()
  const refs = await caller.facturation.referentials()
  return (
    <FinanceLineForm
      pharmacies={refs.pharmacies}
      candidates={refs.candidates}
      missions={refs.missions}
    />
  )
}
