import { redirect } from 'next/navigation'
import { auth } from '@/server/auth'
import { createServerCaller } from '@/lib/trpc/server'
import { ContactCreatePage } from '@/components/organisms/contact-create-page/ContactCreatePage'
import {
  buildContactCreateDefaults,
  resolveContactCreatePharmacy,
  resolveContactCreateReferent,
  resolveDefaultContactRoleId,
} from '@/view-models/contact-create-defaults'

type Props = { searchParams: Promise<{ pharmacyId?: string }> }

export default async function Page({ searchParams }: Props) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const { pharmacyId } = await searchParams
  const caller = await createServerCaller()
  const [contactRefs, pharmacyRefs] = await Promise.all([
    caller.contact.referentials(),
    caller.pharmacy.referentials(),
  ])
  const resolvedPharmacyId = resolveContactCreatePharmacy(pharmacyId, contactRefs.pharmacies)
  const pharmacy = resolvedPharmacyId
    ? await caller.pharmacy.getById({ id: resolvedPharmacyId })
    : null
  const referentId = resolveContactCreateReferent(
    pharmacy?.formSource.referentId,
    session.user.id,
  )

  return (
    <ContactCreatePage
      defaultValues={buildContactCreateDefaults({
        pharmacyId: resolvedPharmacyId,
        referentId,
        contactRoleId: resolveDefaultContactRoleId(contactRefs.contactRoles),
      })}
      pharmacies={contactRefs.pharmacies}
      contactRoles={contactRefs.contactRoles}
      recruiters={pharmacyRefs.recruiters}
    />
  )
}
