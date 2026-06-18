import { type ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/server/auth'
import { HOME_PATH } from '@/server/auth/access'
import { AdminLayoutShell } from '@/components/organisms/AdminLayoutShell'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') redirect(HOME_PATH)

  return <AdminLayoutShell>{children}</AdminLayoutShell>
}
