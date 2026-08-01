import { type ReactNode } from 'react'
import { auth } from '@/server/auth'
import { getIdleTimeoutMs } from '@/server/auth/constants'
import { DashboardShell } from '@/components/organisms/DashboardShell'
import { IdleSessionGuard } from '@/components/providers/IdleSessionGuard'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  return (
    <IdleSessionGuard idleMs={getIdleTimeoutMs()}>
      <DashboardShell role={session?.user?.role ?? null}>{children}</DashboardShell>
    </IdleSessionGuard>
  )
}
