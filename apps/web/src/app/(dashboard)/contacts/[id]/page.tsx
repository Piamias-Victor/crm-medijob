import { notFound } from 'next/navigation'
import { createServerCaller } from '@/lib/trpc/server'
import { ContactDetailPage } from '@/components/organisms/ContactDetailPage'

type Props = { params: Promise<{ id: string }> }

export default async function Page({ params }: Props) {
  const { id } = await params
  const caller = await createServerCaller()
  const [contact, missions, pharmacies] = await Promise.all([
    caller.contact.getById({ id }),
    caller.contact.missions({ id }),
    caller.contact.pharmacyOptions(),
  ])

  if (!contact) notFound()

  return <ContactDetailPage contact={contact} missions={missions} pharmacies={pharmacies} />
}
