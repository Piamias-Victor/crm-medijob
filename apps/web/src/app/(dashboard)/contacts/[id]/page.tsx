import { notFound } from 'next/navigation'
import { createServerCaller } from '@/lib/trpc/server'
import { ContactDetailPage } from '@/components/organisms/ContactDetailPage'
import { parseContactBackHref } from '@/lib/contact-href'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ back?: string }>
}

export default async function Page({ params, searchParams }: Props) {
  const { id } = await params
  const { back } = await searchParams
  const caller = await createServerCaller()
  const [contact, missions, contactRefs, pharmacyRefs, activities, documents] = await Promise.all([
    caller.contact.getById({ id }),
    caller.contact.missions({ id }),
    caller.contact.referentials(),
    caller.pharmacy.referentials(),
    caller.activityLog.listByEntity({ entityType: 'CONTACT', entityId: id }),
    caller.document.listByEntity({ entityType: 'CONTACT', entityId: id }),
  ])

  if (!contact) notFound()

  return (
    <ContactDetailPage
      contact={contact}
      missions={missions}
      pharmacies={contactRefs.pharmacies}
      contactRoles={contactRefs.contactRoles}
      recruiters={pharmacyRefs.recruiters}
      activities={activities}
      documents={documents}
      backHref={parseContactBackHref(back)}
    />
  )
}
