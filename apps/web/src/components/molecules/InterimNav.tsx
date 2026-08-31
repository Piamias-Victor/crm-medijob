'use client'

import { usePathname } from 'next/navigation'
import { interimSubNav } from '@/lib/navigation'
import { PillNav } from '@/components/molecules/PillNav'

export function InterimNav() {
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)
  return <PillNav items={interimSubNav} isActive={isActive} />
}
