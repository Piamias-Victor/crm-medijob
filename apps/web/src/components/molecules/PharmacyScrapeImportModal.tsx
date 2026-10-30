'use client'

import { GlassModal } from '@/components/molecules/GlassModal'
import { ProgressBar } from '@/components/atoms/ProgressBar'
import type { usePharmacyScrapeImport } from '@/lib/hooks/use-pharmacy-scrape-import'

type State = ReturnType<typeof usePharmacyScrapeImport>

export function PharmacyScrapeImportModal({ state }: { state: State }) {
  const busy = state.phase === 'reading' || state.phase === 'analyzing' || state.phase === 'importing'
  const canConfirm = state.phase === 'ready' && Boolean(state.preview) && !state.error
  const title =
    state.phase === 'done'
      ? 'Import terminé'
      : state.phase === 'ready'
        ? 'Prévisualisation EDITH'
        : 'Import EDITH'

  return (
    <GlassModal
      open={state.open}
      onClose={busy ? () => undefined : state.cancel}
      title={title}
      description={state.statusLabel}
      preventDismiss={busy}
      trapFocus
      className="max-w-lg"
    >
      <div className="space-y-4">
        {busy && (
          <ProgressBar
            value={state.progress}
            label={`${state.statusLabel} (${state.progress}%)`}
            indeterminate={state.phase === 'analyzing'}
          />
        )}
        {state.error && <p className="text-sm text-red-700">{state.error}</p>}
        {state.preview && state.phase !== 'importing' && (
          <div className="space-y-2 text-sm text-fg">
            <p>
              {state.preview.rowCount} lignes à upsert · {state.preview.skippedCount} ignorées
            </p>
            {state.preview.skipped.length > 0 && (
              <ul className="max-h-40 overflow-y-auto rounded-md border border-border bg-surface p-2 text-xs text-fg-muted">
                {state.preview.skipped.map((s) => (
                  <li key={`${s.row}-${s.reason}`}>
                    Ligne {s.row} : {s.reason}
                  </li>
                ))}
                {state.preview.skippedCount > state.preview.skipped.length && (
                  <li>… et {state.preview.skippedCount - state.preview.skipped.length} autres</li>
                )}
              </ul>
            )}
          </div>
        )}
        {state.result && state.phase === 'done' && (
          <p className="text-sm text-fg">
            {state.result.created} créées · {state.result.updated} mises à jour
          </p>
        )}
        <div className="flex flex-wrap justify-end gap-2">
          {state.phase === 'done' ? (
            <button
              type="button"
              className="rounded-md bg-fg px-3 py-1.5 text-sm text-bg"
              onClick={state.cancel}
            >
              Fermer
            </button>
          ) : (
            <>
              <button
                type="button"
                className="rounded-md border border-border px-3 py-1.5 text-sm"
                disabled={busy}
                onClick={state.cancel}
              >
                Annuler
              </button>
              <button
                type="button"
                className="rounded-md bg-fg px-3 py-1.5 text-sm text-bg disabled:opacity-50"
                disabled={!canConfirm || busy}
                onClick={() => void state.confirm()}
              >
                Importer
              </button>
            </>
          )}
        </div>
      </div>
    </GlassModal>
  )
}
