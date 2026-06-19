import { createServerCaller } from '@/lib/trpc/server'
import { ContactsPage } from '@/components/organisms/ContactsPage'

export default async function Page() {
  const caller = await createServerCaller()
  const [rows, pharmacies] = await Promise.all([
    caller.contact.list(),
    caller.contact.pharmacyOptions(),
  ])

  return <ContactsPage rows={rows} pharmacies={pharmacies} />
}
