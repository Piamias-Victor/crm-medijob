'use client'

import { useMemo, useState } from 'react'
import { Megaphone, Plus } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { EntityListPageShell } from '@/components/molecules/EntityListPageShell'
import { JobOfferTable } from '@/components/organisms/job-offer-table/job-offer-table'
import { JobOfferMapView } from '@/components/organisms/JobOfferMapView'
import { OffresPageCreate } from '@/components/organisms/offres-page-create'
import type { EntityTableSortState } from '@/components/organisms/entity-table/entity-table-types'
import type { JobOfferListRow } from '@/view-models/job-offer-list'
import { CREATE_OFFER_LABEL } from '@/view-models/mission-offer-picker'

type Props = { initialRows: JobOfferListRow[] }
type View = 'list' | 'map'

export function OffresPage({ initialRows }: Props) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<View>('list')
  const [sort, setSort] = useState<EntityTableSortState | null>(null)
  const description = useMemo(
    () => `${initialRows.length} offre(s) — brouillons et publications site.`,
    [initialRows.length],
  )

  return (
    <EntityListPageShell
      icon={<Megaphone className="size-5" />}
      title="Offres"
      description={description}
      sectionTitle={view === 'list' ? 'Annonces' : 'Carte'}
      sectionDescription={
        view === 'list'
          ? 'Offres liées et sans mission — édition, publication, candidatures.'
          : 'Pins Leaflet (OSM). Filtrez par source Mission / Sans mission.'
      }
      action={
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant={view === 'list' ? 'accent' : 'outline'}
            onClick={() => setView('list')}
          >
            Liste
          </Button>
          <Button
            type="button"
            variant={view === 'map' ? 'accent' : 'outline'}
            onClick={() => setView('map')}
          >
            Carte
          </Button>
          <Button
            variant="accent"
            className="shadow-md shadow-accent/20"
            onClick={() => setOpen(true)}
          >
            <Plus className="size-4" />
            {CREATE_OFFER_LABEL}
          </Button>
        </div>
      }
      modal={<OffresPageCreate open={open} onOpenChange={setOpen} />}
    >
      {view === 'list' ? (
        <JobOfferTable rows={initialRows} sort={sort} onSortChange={setSort} />
      ) : (
        <JobOfferMapView rows={initialRows} />
      )}
    </EntityListPageShell>
  )
}
