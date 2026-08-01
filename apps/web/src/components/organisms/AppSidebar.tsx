'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { navItems, adminNavItem } from '@/lib/navigation'
import type { AccessRole } from '@/server/auth/access'
import { can } from '@/server/auth/permissions'
import { useSidebarStore } from '@/stores/sidebar-store'
import { NavLink } from '@/components/molecules/NavLink'
import { SidebarBrand } from '@/components/molecules/SidebarBrand'
import { GlobalSearchTrigger } from '@/components/molecules/GlobalSearchTrigger'
import { LogoutButton } from '@/components/molecules/LogoutButton'
import { cn } from '@/lib/cn'

const COLLAPSED_WIDTH = 'w-16'
const EXPANDED_WIDTH = 'w-60'

export function AppSidebar({ role }: { role: AccessRole }) {
  const pathname = usePathname()
  const open = useSidebarStore((state) => state.open)
  const setOpen = useSidebarStore((state) => state.setOpen)
  const [hovered, setHovered] = useState(false)
  const expanded = hovered || open

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Fermer la navigation"
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}
      <aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col overflow-hidden border-r border-border bg-white p-2 transition-[width,box-shadow] duration-300 ease-out',
          expanded ? 'shadow-lg' : 'shadow-sm',
          open ? 'flex' : 'hidden md:flex',
          expanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
        )}
      >
        <SidebarBrand expanded={expanded} />
        <div className="mt-3">
          <GlobalSearchTrigger expanded={expanded} />
        </div>
        <nav className="mt-2 flex flex-1 flex-col gap-1">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(item.href)} expanded={expanded} />
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-1 border-t border-border pt-3">
          {role && can(role, 'admin') ? (
            <NavLink item={adminNavItem} active={isActive(adminNavItem.href)} expanded={expanded} />
          ) : null}
          <LogoutButton expanded={expanded} />
        </div>
      </aside>
    </>
  )
}
