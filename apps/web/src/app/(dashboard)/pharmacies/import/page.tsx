import { redirect } from 'next/navigation'
import { auth } from '@/server/auth'
import { PharmacyCsvImportPage } from '@/components/organisms/pharmacy-csv-import/PharmacyCsvImportPage'

export default async function Page() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  return <PharmacyCsvImportPage />
}
