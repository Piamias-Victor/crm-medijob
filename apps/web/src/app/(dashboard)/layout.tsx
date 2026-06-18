import { type ReactNode } from 'react'
import { DashboardShell } from '@/components/organisms/DashboardShell'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>
}
