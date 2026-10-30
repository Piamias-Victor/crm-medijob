'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import type { PharmacyScrapeListFilters } from '@/view-models/pharmacy-scrape-list-filters'

const EMPTY: PharmacyScrapeListFilters = {}

export function usePharmacyScrapeList() {
  const [filters, setFilters] = useState<PharmacyScrapeListFilters>(EMPTY)
  const query = trpc.pharmacyScrape.list.useQuery(filters)
  const provenances = trpc.pharmacyScrape.provenances.useQuery()
  const departments = trpc.pharmacyScrape.departments.useQuery()
  return {
    filters,
    setFilters,
    rows: query.data ?? [],
    isLoading: query.isLoading,
    provenances: provenances.data ?? [],
    departments: departments.data ?? [],
    refetch: query.refetch,
  }
}
