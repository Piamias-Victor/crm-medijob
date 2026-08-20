'use client'

import { usePathname } from 'next/navigation'
import { facturationSubNav } from '@/lib/navigation'
import { PillNav } from '@/components/molecules/PillNav'

export function FacturationNav() {
  const pathname = usePathname()
  const isActive = (href: string) => {
    if (href === '/facturation') return pathname === '/facturation'
    return pathname === href || pathname.startsWith(`${href}/`)
  }
  return <PillNav items={facturationSubNav} isActive={isActive} />
}
