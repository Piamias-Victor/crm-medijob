'use client'

import { useMemo, useState } from 'react'
import { Megaphone, Plus } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { EntityListPageShell } from '@/components/molecules/EntityListPageShell'
import { JobOfferTable } from '@/components/organisms/job-offer-table/job-offer-table'
import { OffresPageCreate } from '@/components/organisms/offres-page-create'
import type { EntityTableSortState } from '@/components/organisms/entity-table/entity-table-types'
import type { JobOfferListRow } from '@/view-models/job-offer-list'
import { CREATE_OFFER_LABEL } from '@/view-models/mission-offer-picker'

type Props = { initialRows: JobOfferListRow[] }

export function OffresPage({ initialRows }: Props) {
  const [open, setOpen] = useState(false)
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
      sectionTitle="Annonces"
      sectionDescription="Offres générées depuis les missions — édition, publication et suivi des candidatures."
      action={
        <Button
          variant="accent"
          className="shadow-md shadow-accent/20"
          onClick={() => setOpen(true)}
        >
          <Plus className="size-4" />
          {CREATE_OFFER_LABEL}
        </Button>
      }
      modal={<OffresPageCreate open={open} onOpenChange={setOpen} />}
    >
      <JobOfferTable rows={initialRows} sort={sort} onSortChange={setSort} />
    </EntityListPageShell>
  )
}
