'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { facturationSubNav } from '@/lib/navigation'
import { PillNav } from '@/components/molecules/PillNav'

export function FacturationNav() {
  const pathname = usePathname()
  const search = useSearchParams().toString()
  const items = facturationSubNav.map((item) => ({
    ...item,
    href: search ? `${item.href}?${search}` : item.href,
  }))
  const isActive = (href: string) => {
    const path = href.split('?')[0] ?? href
    if (path === '/facturation') return pathname === '/facturation'
    return pathname === path || pathname.startsWith(`${path}/`)
  }
  return <PillNav items={items} isActive={isActive} />
}
