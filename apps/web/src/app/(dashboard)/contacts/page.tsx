import { createServerCaller } from '@/lib/trpc/server'
import { ContactsPage } from '@/components/organisms/ContactsPage'

export default async function Page() {
  const caller = await createServerCaller()
  const rows = await caller.contact.list()

  return <ContactsPage rows={rows} />
}
