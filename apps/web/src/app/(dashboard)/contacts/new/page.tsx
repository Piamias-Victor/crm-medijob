import { redirect } from 'next/navigation'
import { auth } from '@/server/auth'
import { createServerCaller } from '@/lib/trpc/server'
import { ContactCreatePage } from '@/components/organisms/contact-create-page/ContactCreatePage'
import {
  buildContactCreateDefaults,
  resolveContactCreatePharmacy,
} from '@/view-models/contact-create-defaults'

type Props = { searchParams: Promise<{ pharmacyId?: string }> }

export default async function Page({ searchParams }: Props) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const { pharmacyId } = await searchParams
  const caller = await createServerCaller()
  const pharmacies = await caller.contact.referentials()
  const resolvedPharmacyId = resolveContactCreatePharmacy(pharmacyId, pharmacies)

  return (
    <ContactCreatePage
      defaultValues={buildContactCreateDefaults(resolvedPharmacyId)}
      pharmacies={pharmacies}
    />
  )
}
