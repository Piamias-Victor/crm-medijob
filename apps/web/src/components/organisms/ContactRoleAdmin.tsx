'use client'

import { trpc } from '@/lib/trpc/client'
import { ReferentialAdmin } from '@/components/organisms/ReferentialAdmin'
import type { RefItem } from '@/view-models/referential'

export function ContactRoleAdmin({ items }: { items: RefItem[] }) {
  return (
    <ReferentialAdmin
      title="Rôles contact"
      description="Fonctions administrables des contacts en pharmacie."
      itemLabel="rôle"
      items={items}
      procedures={trpc.admin.contactRole}
    />
  )
}
