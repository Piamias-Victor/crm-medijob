'use client'

import { trpc } from '@/lib/trpc/client'
import { ReferentialAdmin } from '@/components/organisms/ReferentialAdmin'
import type { RefItem } from '@/view-models/referential'

export function GroupementAdmin({ items }: { items: RefItem[] }) {
  return (
    <ReferentialAdmin
      title="Groupements"
      description="Réseaux et groupements de pharmacies."
      itemLabel="groupement"
      items={items}
      procedures={trpc.admin.groupement}
    />
  )
}
