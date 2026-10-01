'use client'

import { useMemo, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Button } from '@/components/atoms/Button'
import { EntityMapWithLayers } from '@/components/organisms/EntityMapWithLayers'
import {
  filterOffersBySource,
  toJobOfferMapPins,
} from '@/view-models/job-offer-map'
import type { JobOfferListRow } from '@/view-models/job-offer-list'

type SourceFilter = 'all' | 'mission' | 'standalone'
type Props = { rows: JobOfferListRow[] }

const SOURCE_OPTIONS: { value: SourceFilter; label: string }[] = [
  { value: 'all', label: 'Toutes' },
  { value: 'mission', label: 'Mission' },
  { value: 'standalone', label: 'Sans mission' },
]

export function JobOfferMapView({ rows }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [source, setSource] = useState<SourceFilter>('all')
  const pins = useMemo(
    () => toJobOfferMapPins(filterOffersBySource(rows, source)),
    [rows, source],
  )
  const returnPath = useMemo(() => {
    const query = searchParams.toString()
    return query ? `${pathname}?${query}` : pathname
  }, [pathname, searchParams])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {SOURCE_OPTIONS.map((option) => (
          <Button
            key={option.value}
            type="button"
            variant={source === option.value ? 'accent' : 'outline'}
            className="text-xs"
            onClick={() => setSource(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
      <EntityMapWithLayers
        primaryType="jobOffer"
        primaryPins={pins}
        returnPath={returnPath}
      />
    </div>
  )
}
