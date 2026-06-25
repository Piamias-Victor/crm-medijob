'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { Building2, Plus } from 'lucide-react'
import { accentButtonClassName } from '@/lib/button-styles'
import { EntityListPageShell } from '@/components/molecules/EntityListPageShell'
import { PharmacyList } from '@/components/organisms/PharmacyList'
import type { PharmacyListRow } from '@/view-models/pharmacy-list'

type Props = {
  rows: PharmacyListRow[]
}

export function PharmaciesPage({ rows }: Props) {
  const description = useMemo(() => `${rows.length} officine(s) au portefeuille`, [rows.length])

  return (
    <EntityListPageShell
      icon={<Building2 className="size-5" />}
      title="Pharmacies"
      description={description}
      sectionTitle="Portefeuille client"
      sectionDescription="Officines, groupements, contacts et missions en cours."
      action={
        <Link href="/pharmacies/new" className={accentButtonClassName}>
          <Plus className="size-4" />
          Nouvelle pharmacie
        </Link>
      }
    >
      <PharmacyList rows={rows} />
    </EntityListPageShell>
  )
}
