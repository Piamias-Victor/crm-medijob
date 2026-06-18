import { createServerCaller } from '@/lib/trpc/server'
import { PharmaciesView } from '@/components/organisms/PharmaciesView'

export default async function PharmaciesPage() {
  const caller = await createServerCaller()
  const [rows, referentials] = await Promise.all([
    caller.pharmacy.list(),
    caller.pharmacy.referentials(),
  ])

  return (
    <PharmaciesView
      rows={rows}
      groupements={referentials.groupements}
      softwares={referentials.softwares}
    />
  )
}
