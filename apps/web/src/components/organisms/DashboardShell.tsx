'use client'

import { type ReactNode } from 'react'
import { Menu } from 'lucide-react'
import { AppSidebar } from '@/components/organisms/AppSidebar'
import { Button } from '@/components/atoms/Button'
import type { AccessRole } from '@/server/auth/access'
import { useSidebarStore } from '@/stores/sidebar-store'

export function DashboardShell({ children, role }: { children: ReactNode; role: AccessRole }) {
  const toggle = useSidebarStore((state) => state.toggle)

  return (
    <div className="flex min-h-dvh bg-surface">
      <AppSidebar role={role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b border-border bg-white px-4 md:hidden">
          <Button
            variant="ghost"
            onClick={toggle}
            aria-label="Basculer la navigation"
            className="px-2"
          >
            <Menu className="size-5" />
          </Button>
          <span className="font-bold tracking-tight">MEDIJOB</span>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
