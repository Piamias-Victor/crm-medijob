import { createServerCaller } from '@/lib/trpc/server'
import { PharmaciesPage } from '@/components/organisms/PharmaciesPage'

export default async function Page() {
  const caller = await createServerCaller()
  const [rows, referentials] = await Promise.all([
    caller.pharmacy.list(),
    caller.pharmacy.referentials(),
  ])

  return (
    <PharmaciesPage
      rows={rows}
      groupements={referentials.groupements}
      softwares={referentials.softwares}
    />
  )
}
