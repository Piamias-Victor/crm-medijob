import { createServerCaller } from '@/lib/trpc/server'
import { ContactsView } from '@/components/organisms/ContactsView'

export default async function ContactsPage() {
  const caller = await createServerCaller()
  const [rows, pharmacies] = await Promise.all([
    caller.contact.list(),
    caller.contact.pharmacyOptions(),
  ])

  return <ContactsView rows={rows} pharmacies={pharmacies} />
}
