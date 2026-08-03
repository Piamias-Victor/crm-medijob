'use client'

import { useMemo, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { EntityMap } from '@/components/molecules/EntityMap'
import { PharmacyQuickView } from '@/components/organisms/PharmacyQuickView'
import { PharmacyFilterBar } from '@/components/organisms/pharmacy-table/pharmacy-filter-bar'
import { buildPharmacyReturnPath } from '@/lib/pharmacy-href'
import { toPharmacyMapPins } from '@/view-models/entity-map-pins'
import type { PharmacyFilterConfig } from '@/lib/filters/pharmacy-filter-config'
import type { PharmacyFilterValues } from '@/lib/filters/pharmacy-filter-map'
import type { PharmacyListRow } from '@/view-models/pharmacy-list'

type Props = {
  rows: PharmacyListRow[]
  filterConfig: PharmacyFilterConfig
  values: PharmacyFilterValues
  onChange: (values: PharmacyFilterValues) => void
  onReset: () => void
}

export function PharmacyMapView({ rows, filterConfig, values, onChange, onReset }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [quickViewId, setQuickViewId] = useState<string | null>(null)
  const pins = useMemo(() => toPharmacyMapPins(rows), [rows])
  const returnPath = useMemo(
    () => buildPharmacyReturnPath(pathname, searchParams.toString()),
    [pathname, searchParams],
  )

  return (
    <div className="space-y-4">
      <PharmacyFilterBar
        filterConfig={filterConfig}
        values={values}
        onChange={onChange}
        onReset={onReset}
      />
      <EntityMap pins={pins} onPinClick={setQuickViewId} />
      <PharmacyQuickView
        pharmacyId={quickViewId}
        returnPath={returnPath}
        onClose={() => setQuickViewId(null)}
      />
    </div>
  )
}
