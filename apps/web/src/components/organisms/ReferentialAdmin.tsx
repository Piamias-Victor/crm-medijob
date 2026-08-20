'use client'

import { ReferentialManager } from '@/components/organisms/ReferentialManager'
import {
  useReferentialAdminMutations,
  type ReferentialCrudProcedures,
} from '@/lib/hooks/use-referential-admin-mutations'
import type { RefItem } from '@/view-models/referential'

type Props = {
  title: string
  description: string
  itemLabel: string
  items: RefItem[]
  procedures: ReferentialCrudProcedures
}

export function ReferentialAdmin({ title, description, itemLabel, items, procedures }: Props) {
  const actions = useReferentialAdminMutations(procedures)
  return (
    <ReferentialManager
      title={title}
      description={description}
      itemLabel={itemLabel}
      items={items}
      {...actions}
    />
  )
}
