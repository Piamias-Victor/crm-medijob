'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { adminSubNav } from '@/lib/navigation'
import { adminNavLinkClass } from '@/view-models/admin-nav-link'

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-wrap gap-2">
      {adminSubNav.map((item) => {
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={adminNavLinkClass(active)}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
