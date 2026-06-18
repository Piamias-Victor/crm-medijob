'use client'

import { usePathname } from 'next/navigation'
import { adminSubNav } from '@/lib/navigation'
import { PillNav } from '@/components/molecules/PillNav'

export function AdminNav() {
  const pathname = usePathname()
  return <PillNav items={adminSubNav} isActive={(href) => pathname === href} />
}
