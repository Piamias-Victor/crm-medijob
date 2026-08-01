import { type ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/server/auth'
import { HOME_PATH } from '@/server/auth/access'
import { can } from '@/server/auth/permissions'
import { AdminLayoutShell } from '@/components/organisms/AdminLayoutShell'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  const role = session?.user?.role
  if (!role || !can(role, 'admin')) redirect(HOME_PATH)

  return <AdminLayoutShell>{children}</AdminLayoutShell>
}
