'use client'

import { Building2 } from 'lucide-react'
import { InterimTable } from '@/components/organisms/interim-table/interim-table'
import { enterpriseColumns } from '@/components/organisms/interim-table/interim-table-columns'
import { enterpriseFilterConfig, matchesEnterprise } from '@/lib/filters/badakan-interim-filters'
import type { BadakanEnterpriseListItem } from '@/view-models/badakan-enterprise-list'

export function BadakanEnterpriseList({ rows }: { rows: BadakanEnterpriseListItem[] }) {
  return (
    <InterimTable
      rows={rows}
      columns={enterpriseColumns}
      filterConfig={enterpriseFilterConfig}
      matches={matchesEnterprise}
      getRowHref={(row) => row.href}
      emptyIcon={Building2}
      emptyTitle="Aucune officine à vérifier"
      emptyDescription="Ajustez les filtres pour afficher des résultats."
    />
  )
}
