'use client'

import { PHARMACY_SCRAPE_IMPORT } from '@/lib/constants/pharmacy-scrape-copy'
import { usePharmacyScrapeImport } from '@/lib/hooks/use-pharmacy-scrape-import'
import { PharmacyScrapeImportModal } from '@/components/molecules/PharmacyScrapeImportModal'

type Props = { onDone: () => void }

export function PharmacyScrapeImport({ onDone }: Props) {
  const state = usePharmacyScrapeImport(onDone)

  return (
    <div className="mb-4">
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-fg hover:bg-surface">
        {PHARMACY_SCRAPE_IMPORT}
        <input
          type="file"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className="hidden"
          disabled={state.open}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void state.onFile(file)
            e.target.value = ''
          }}
        />
      </label>
      <PharmacyScrapeImportModal state={state} />
    </div>
  )
}
