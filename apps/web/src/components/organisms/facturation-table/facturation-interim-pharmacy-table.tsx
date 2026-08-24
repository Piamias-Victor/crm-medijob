'use client'

import { Building2 } from 'lucide-react'
import { EntityTable } from '@/components/organisms/entity-table/entity-table'
import { interimPharmacyColumns } from '@/components/organisms/facturation-table/facturation-interim-pharmacy-columns'
import {
  INTERIM_PHARMACY_EMPTY_DESCRIPTION,
  INTERIM_PHARMACY_EMPTY_TITLE,
} from '@/view-models/facturation-interim-copy'
import { buildInterimPharmacyAggregates } from '@/view-models/facturation-interim-pharmacy'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

type Props = { rows: FacturationSuiviRow[] }

export function FacturationInterimPharmacyTable({ rows }: Props) {
  const pharmacies = buildInterimPharmacyAggregates(rows)
  return (
    <EntityTable
      rows={pharmacies}
      columns={interimPharmacyColumns}
      getRowId={(row) => row.pharmacyId}
      emptyIcon={Building2}
      emptyTitle={INTERIM_PHARMACY_EMPTY_TITLE}
      emptyDescription={INTERIM_PHARMACY_EMPTY_DESCRIPTION}
    />
  )
}
