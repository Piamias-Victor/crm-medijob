'use client'

import { type ReactNode } from 'react'
import { Menu } from 'lucide-react'
import { AppAtmosphere } from '@/components/molecules/AppAtmosphere'
import { AppSidebar } from '@/components/organisms/AppSidebar'
import { Button } from '@/components/atoms/Button'
import type { AccessRole } from '@/server/auth/access'
import { useSidebarStore } from '@/stores/sidebar-store'

export function DashboardShell({ children, role }: { children: ReactNode; role: AccessRole }) {
  const toggle = useSidebarStore((state) => state.toggle)

  return (
    <div className="flex min-h-dvh">
      <AppSidebar role={role} />
      <div className="flex min-w-0 flex-1 flex-col md:pl-16">
        <header className="relative z-10 flex h-14 items-center gap-3 border-b border-border/70 bg-white/90 px-4 backdrop-blur-md md:hidden">
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
    <AppAtmosphere className="flex flex-1 flex-col">
          <main className="relative flex-1 p-6">{children}</main>
        </AppAtmosphere>
      </div>
    </div>
  )
}
