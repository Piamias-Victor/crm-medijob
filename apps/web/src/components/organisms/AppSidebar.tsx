'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { navItems, adminNavItem } from '@/lib/navigation'
import type { AccessRole } from '@/server/auth/access'
import { useSidebarStore } from '@/stores/sidebar-store'
import { NavLink } from '@/components/molecules/NavLink'
import { SidebarBrand } from '@/components/molecules/SidebarBrand'
import { LogoutButton } from '@/components/molecules/LogoutButton'
import { cn } from '@/lib/cn'

export function AppSidebar({ role }: { role: AccessRole }) {
  const pathname = usePathname()
  const open = useSidebarStore((state) => state.open)
  const [hovered, setHovered] = useState(false)
  const expanded = hovered || open

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'shrink-0 flex-col overflow-hidden border-r border-border bg-white p-3 transition-[width] duration-200 ease-out md:flex',
        open ? 'flex' : 'hidden',
        expanded ? 'w-60' : 'w-60 md:w-16',
      )}
    >
      <SidebarBrand expanded={expanded} />
      <nav className="mt-4 flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(item.href)} expanded={expanded} />
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-1 border-t border-border pt-3">
        {role === 'ADMIN' ? (
          <NavLink item={adminNavItem} active={isActive(adminNavItem.href)} expanded={expanded} />
        ) : null}
        <LogoutButton expanded={expanded} />
      </div>
    </aside>
  )
}
