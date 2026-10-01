'use client'

import { useMemo, useState } from 'react'
import { EntityMap } from '@/components/molecules/EntityMap'
import { Button } from '@/components/atoms/Button'
import {
  filterOffersBySource,
  toJobOfferMapPins,
} from '@/view-models/job-offer-map'
import type { JobOfferListRow } from '@/view-models/job-offer-list'

type SourceFilter = 'all' | 'mission' | 'standalone'
type Props = { rows: JobOfferListRow[] }

export function JobOfferMapView({ rows }: Props) {
  const [source, setSource] = useState<SourceFilter>('all')
  const pins = useMemo(
    () => toJobOfferMapPins(filterOffersBySource(rows, source)),
    [rows, source],
  )

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(['all', 'mission', 'standalone'] as const).map((value) => (
          <Button
            key={value}
            type="button"
            variant={source === value ? 'accent' : 'outline'}
            className="text-xs"
            onClick={() => setSource(value)}
          >
            {value === 'all' ? 'Toutes' : value === 'mission' ? 'Mission' : 'Sans mission'}
          </Button>
        ))}
      </div>
      <EntityMap pins={pins} />
    </div>
  )
}
