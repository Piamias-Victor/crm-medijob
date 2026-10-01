'use client'

import { useMemo, useState } from 'react'
import { Megaphone, Plus } from 'lucide-react'
import { accentButtonClassName } from '@/lib/button-styles'
import { DashboardPage } from '@/components/molecules/DashboardPage'
import { EntityViewShell } from '@/components/molecules/EntityViewShell'
import { JobOfferTable } from '@/components/organisms/job-offer-table/job-offer-table'
import { JobOfferMapView } from '@/components/organisms/JobOfferMapView'
import { OffresPageCreate } from '@/components/organisms/offres-page-create'
import type { EntityTableSortState } from '@/components/organisms/entity-table/entity-table-types'
import type { JobOfferListRow } from '@/view-models/job-offer-list'
import { CREATE_OFFER_LABEL } from '@/view-models/mission-offer-picker'
import { pharmacyViewOptions, type PharmacyView } from '@/components/molecules/ViewToggle'

type Props = { initialRows: JobOfferListRow[] }

export function OffresPage({ initialRows }: Props) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<PharmacyView>('list')
  const [sort, setSort] = useState<EntityTableSortState | null>(null)
  const description = useMemo(
    () => `${initialRows.length} offre(s) — brouillons et publications site.`,
    [initialRows.length],
  )

  return (
    <DashboardPage
      icon={<Megaphone className="size-5" />}
      title="Offres"
      description={description}
      actions={
        <button type="button" className={accentButtonClassName} onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          {CREATE_OFFER_LABEL}
        </button>
      }
    >
      <EntityViewShell
        view={view}
        onViewChange={setView}
        viewOptions={pharmacyViewOptions}
        panels={{
          list: {
            title: 'Annonces',
            description: 'Offres liées et sans mission — édition, publication, candidatures.',
            content: (
              <JobOfferTable rows={initialRows} sort={sort} onSortChange={setSort} />
            ),
          },
          map: {
            title: 'Carte offres',
            description: 'Filtrez Mission / Sans mission. Couches pharmacies, candidats, missions.',
            content: <JobOfferMapView rows={initialRows} />,
          },
        }}
      />
      <OffresPageCreate open={open} onOpenChange={setOpen} />
    </DashboardPage>
  )
}
