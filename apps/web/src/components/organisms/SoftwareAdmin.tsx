'use client'

import { trpc } from '@/lib/trpc/client'
import { ReferentialAdmin } from '@/components/organisms/ReferentialAdmin'
import type { RefItem } from '@/view-models/referential'

export function SoftwareAdmin({ items }: { items: RefItem[] }) {
  return (
    <ReferentialAdmin
      title="Logiciels"
      description="LGO et logiciels pharmacie pour candidats et officines."
      itemLabel="logiciel"
      items={items}
      procedures={trpc.admin.software}
    />
  )
}
