import { type ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/server/auth'
import { HOME_PATH } from '@/server/auth/access'
import { can } from '@/server/auth/permissions'
import { FacturationLayoutShell } from '@/components/organisms/FacturationLayoutShell'

export default async function FacturationLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  const role = session?.user?.role
  if (!role || !can(role, 'finance.view')) redirect(HOME_PATH)

  return <FacturationLayoutShell>{children}</FacturationLayoutShell>
}
