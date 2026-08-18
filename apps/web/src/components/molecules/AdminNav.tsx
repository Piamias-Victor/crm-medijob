'use client'

import { usePathname } from 'next/navigation'
import { adminSubNav } from '@/lib/navigation'
import { PillNav } from '@/components/molecules/PillNav'

export function AdminNav() {
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)
  return <PillNav items={adminSubNav} isActive={isActive} />
}
