import { redirect } from 'next/navigation'
import { auth } from '@/server/auth'
import { createServerCaller } from '@/lib/trpc/server'
import { PharmacyCreatePage } from '@/components/organisms/pharmacy-create-page/PharmacyCreatePage'
import { buildPharmacyCreateDefaults } from '@/view-models/pharmacy-create-defaults'

export default async function Page() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const caller = await createServerCaller()
  const referentials = await caller.pharmacy.referentials()

  return (
    <PharmacyCreatePage
      defaultValues={buildPharmacyCreateDefaults()}
      groupements={referentials.groupements}
      softwares={referentials.softwares}
    />
  )
}
