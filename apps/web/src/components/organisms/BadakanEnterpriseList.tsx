'use client'

import { Building2 } from 'lucide-react'
import { BadakanEnterpriseListCard } from '@/components/molecules/BadakanEnterpriseListCard'
import { EntityGridList } from '@/components/organisms/EntityGridList'
import type { BadakanEnterpriseListItem } from '@/view-models/badakan-enterprise-list'

export function BadakanEnterpriseList({ rows }: { rows: BadakanEnterpriseListItem[] }) {
  return (
    <EntityGridList
      items={rows}
      getKey={(row) => row.id}
      renderItem={(row) => <BadakanEnterpriseListCard row={row} />}
      emptyIcon={Building2}
      emptyTitle="Aucune officine à vérifier"
      emptyDescription="Les enterprises Badakan synchronisées apparaîtront ici."
    />
  )
}
