'use client'

import { PharmacyScrapeFilters } from '@/components/molecules/PharmacyScrapeFilters'
import { PharmacyScrapeImport } from '@/components/molecules/PharmacyScrapeImport'
import { PharmacyScrapeTable } from '@/components/molecules/PharmacyScrapeTable'
import { usePharmacyScrapeList } from '@/lib/hooks/use-pharmacy-scrape-list'
import { useCan } from '@/lib/hooks/use-can'
import { trpc } from '@/lib/trpc/client'

export function PharmacyScrapePanel() {
  const canAdmin = useCan('admin')
  const { filters, setFilters, rows, isLoading, provenances, departments, refetch } =
    usePharmacyScrapeList()
  const softDelete = trpc.pharmacyScrape.softDelete.useMutation({
    onSuccess: () => void refetch(),
  })

  return (
    <div>
      {canAdmin && <PharmacyScrapeImport onDone={() => void refetch()} />}
      <PharmacyScrapeFilters
        values={filters}
        provenances={provenances}
        departments={departments}
        onChange={setFilters}
      />
      {isLoading ? (
        <p className="text-sm text-muted">Chargement…</p>
      ) : (
        <PharmacyScrapeTable
          rows={rows}
          deletePending={softDelete.isPending}
          onSoftDelete={(ids) => softDelete.mutate({ ids })}
        />
      )}
    </div>
  )
}
