'use client'

import type { PharmacyScrapeListFilters } from '@/view-models/pharmacy-scrape-list-filters'
import {
  PHARMACY_SCRAPE_DEPT_LABEL,
  PHARMACY_SCRAPE_DUP_TOGGLE,
} from '@/lib/constants/pharmacy-scrape-copy'

type Props = {
  values: PharmacyScrapeListFilters
  provenances: string[]
  onChange: (next: PharmacyScrapeListFilters) => void
}

export function PharmacyScrapeFilters({ values, provenances, onChange }: Props) {
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
      <label className="flex w-28 flex-col gap-1 text-xs text-muted">
        {PHARMACY_SCRAPE_DEPT_LABEL}
        <input
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg"
          value={values.department ?? ''}
          onChange={(e) => onChange({ ...values, department: e.target.value || undefined })}
          placeholder="69"
        />
      </label>
      <label className="flex min-w-40 flex-col gap-1 text-xs text-muted">
        Provenance
        <select
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg"
          value={values.provenance ?? ''}
          onChange={(e) => onChange({ ...values, provenance: e.target.value || undefined })}
        >
          <option value="">Toutes</option>
          {provenances.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 pb-2 text-sm text-fg">
        <input
          type="checkbox"
          checked={Boolean(values.duplicatesOnly)}
          onChange={(e) => onChange({ ...values, duplicatesOnly: e.target.checked || undefined })}
        />
        {PHARMACY_SCRAPE_DUP_TOGGLE}
      </label>
    </div>
  )
}
