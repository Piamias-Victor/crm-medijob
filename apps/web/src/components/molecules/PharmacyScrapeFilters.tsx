'use client'

import { Combobox } from '@/components/molecules/Combobox'
import type { PharmacyScrapeListFilters } from '@/view-models/pharmacy-scrape-list-filters'
import { PHARMACY_SCRAPE_DEPT_LABEL } from '@/lib/constants/pharmacy-scrape-copy'
import {
  pharmacyScrapeAllOption,
  toPharmacyScrapeFilterOptions,
} from '@/view-models/pharmacy-scrape-filter-options'

type Props = {
  values: PharmacyScrapeListFilters
  provenances: string[]
  departments: string[]
  onChange: (next: PharmacyScrapeListFilters) => void
}

export function PharmacyScrapeFilters({ values, provenances, departments, onChange }: Props) {
  const deptOptions = [pharmacyScrapeAllOption('Tous'), ...toPharmacyScrapeFilterOptions(departments)]
  const provOptions = [
    pharmacyScrapeAllOption('Toutes'),
    ...toPharmacyScrapeFilterOptions(provenances),
  ]

  return (
    <div className="mb-4 flex flex-wrap items-end gap-3">
      <label className="flex min-w-48 flex-1 flex-col gap-1 text-xs text-muted">
        Recherche
        <input
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg"
          value={values.q ?? ''}
          onChange={(e) => onChange({ ...values, q: e.target.value || undefined })}
          placeholder="Nom, mail, ville…"
        />
      </label>
      <div className="flex w-44 flex-col gap-1 text-xs text-muted">
        {PHARMACY_SCRAPE_DEPT_LABEL}
        <Combobox
          aria-label={PHARMACY_SCRAPE_DEPT_LABEL}
          value={values.department ?? ''}
          options={deptOptions}
          placeholder="Tous"
          onChange={(department) =>
            onChange({ ...values, department: department || undefined })
          }
        />
      </div>
      <div className="flex min-w-48 flex-1 flex-col gap-1 text-xs text-muted">
        Provenance
        <Combobox
          aria-label="Provenance"
          value={values.provenance ?? ''}
          options={provOptions}
          placeholder="Toutes"
          onChange={(provenance) =>
            onChange({ ...values, provenance: provenance || undefined })
          }
        />
      </div>
    </div>
  )
}
