'use client'

import { Button } from '@/components/atoms/Button'
import { CANDIDATE_STATUS_LABELS } from '@/lib/candidate-status-options'
import type { CandidateCsvImportRow, CandidateCsvRowError } from '@/view-models/candidate-csv-import.schema'

type Props = {
  rows: CandidateCsvImportRow[]
  errors: CandidateCsvRowError[]
  pending: boolean
  onBack: () => void
  onCommit: () => void
}

export function CandidateCsvPreviewStep({ rows, errors, pending, onBack, onCommit }: Props) {
  const blocked = errors.length > 0 || rows.length === 0
  return (
    <div className="space-y-4">
      {errors.length > 0 ? (
        <div className="space-y-1 rounded-md border border-danger/40 bg-danger/5 p-3">
          <p className="text-sm font-medium text-danger">Erreurs bloquantes — corrigez le CSV.</p>
          <ul className="list-disc pl-5 text-sm text-danger">
            {errors.slice(0, 20).map((error) => (
              <li key={`${error.row}-${error.message}`}>
                Ligne {error.row} : {error.message}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-fg-muted">{rows.length} ligne(s) prêtes à importer.</p>
      )}
      {rows.length > 0 ? (
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-muted text-fg-muted">
              <tr>
                <th className="px-3 py-2">Nom</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Ville</th>
                <th className="px-3 py-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 10).map((row, index) => (
                <tr key={`${row.email ?? row.lastName}-${index}`} className="border-t border-border">
                  <td className="px-3 py-2">
                    {row.firstName} {row.lastName}
                  </td>
                  <td className="px-3 py-2">{row.email ?? '—'}</td>
                  <td className="px-3 py-2">{row.city ?? '—'}</td>
                  <td className="px-3 py-2">{CANDIDATE_STATUS_LABELS[row.status]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onBack} disabled={pending}>
          Retour
        </Button>
        <Button type="button" variant="accent" onClick={onCommit} disabled={blocked || pending}>
          {pending ? 'Import…' : 'Importer'}
        </Button>
      </div>
    </div>
  )
}
