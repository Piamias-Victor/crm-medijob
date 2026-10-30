'use client'

import { PHARMACY_SCRAPE_IMPORT } from '@/lib/constants/pharmacy-scrape-copy'
import { usePharmacyScrapeImport } from '@/lib/hooks/use-pharmacy-scrape-import'

type Props = { onDone: () => void }

export function PharmacyScrapeImport({ onDone }: Props) {
  const state = usePharmacyScrapeImport(onDone)

  return (
    <div className="mb-4 space-y-3 rounded-md border border-border p-3">
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-fg hover:bg-surface">
          {PHARMACY_SCRAPE_IMPORT}
          <input
            type="file"
            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            className="hidden"
            disabled={state.pending}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void state.onFile(file)
              e.target.value = ''
            }}
          />
        </label>
        {state.pending && <span className="text-sm text-muted">Traitement…</span>}
      </div>
      {state.error && <p className="text-sm text-red-700">{state.error}</p>}
      {state.preview && (
        <div className="space-y-2 text-sm text-fg">
          <p>
            {state.preview.rowCount} lignes à upsert · {state.preview.skippedCount} ignorées ·{' '}
            {state.preview.duplicateEmailCount} mails multi-provenance
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-md bg-fg px-3 py-1.5 text-sm text-bg"
              disabled={state.pending}
              onClick={() => void state.confirm()}
            >
              Confirmer l’import
            </button>
            <button
              type="button"
              className="rounded-md border border-border px-3 py-1.5 text-sm"
              disabled={state.pending}
              onClick={state.cancel}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
      {state.result && (
        <p className="text-sm text-muted">
          Import terminé : {state.result.created} créées, {state.result.updated} mises à jour.
        </p>
      )}
    </div>
  )
}
