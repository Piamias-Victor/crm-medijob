import { type ReactNode } from 'react'
import { auth } from '@/server/auth'
import { DashboardShell } from '@/components/organisms/DashboardShell'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  return <DashboardShell role={session?.user?.role ?? null}>{children}</DashboardShell>
}
