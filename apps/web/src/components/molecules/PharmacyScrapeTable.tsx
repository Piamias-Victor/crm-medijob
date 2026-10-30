'use client'

import { useState } from 'react'
import type { PharmacyScrapeListRow } from '@/view-models/pharmacy-scrape-list-row'
import { PHARMACY_SCRAPE_DEPT_LABEL, PHARMACY_SCRAPE_EMPTY } from '@/lib/constants/pharmacy-scrape-copy'
import { useCan } from '@/lib/hooks/use-can'

type Props = {
  rows: PharmacyScrapeListRow[]
  onSoftDelete: (ids: string[]) => void
  deletePending?: boolean
}

function copyText(value: string) {
  void navigator.clipboard.writeText(value)
}

export function PharmacyScrapeTable({ rows, onSoftDelete, deletePending }: Props) {
  const canAdmin = useCan('admin')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  if (rows.length === 0) {
    return <p className="text-sm text-muted">{PHARMACY_SCRAPE_EMPTY}</p>
  }

  return (
    <div className="space-y-2">
      {canAdmin && selected.size > 0 && (
        <button
          type="button"
          disabled={deletePending}
          className="rounded-md border border-border px-3 py-1.5 text-sm text-fg hover:bg-surface"
          onClick={() => {
            onSoftDelete([...selected])
            setSelected(new Set())
          }}
        >
          Supprimer ({selected.size})
        </button>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border text-xs text-muted">
            <tr>
              {canAdmin && <th className="w-8 py-2" />}
              <th className="py-2 pr-3 font-medium">Nom</th>
              <th className="py-2 pr-3 font-medium">Mail</th>
              <th className="py-2 pr-3 font-medium">Ville</th>
              <th className="py-2 pr-3 font-medium">{PHARMACY_SCRAPE_DEPT_LABEL}</th>
              <th className="py-2 pr-3 font-medium">Provenance</th>
              <th className="py-2 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border/60">
                {canAdmin && (
                  <td className="py-2">
                    <input
                      type="checkbox"
                      checked={selected.has(row.id)}
                      onChange={(e) => {
                        const next = new Set(selected)
                        if (e.target.checked) next.add(row.id)
                        else next.delete(row.id)
                        setSelected(next)
                      }}
                    />
                  </td>
                )}
                <td className="py-2 pr-3">
                  <button type="button" className="text-left hover:underline" onClick={() => copyText(row.name)}>
                    {row.name}
                  </button>
                  {row.isDuplicate && (
                    <span className="ml-2 text-xs text-amber-700">doublon mail</span>
                  )}
                </td>
                <td className="py-2 pr-3">
                  <button type="button" className="hover:underline" onClick={() => copyText(row.email)}>
                    {row.email}
                  </button>
                </td>
                <td className="py-2 pr-3">{row.city ?? '—'}</td>
                <td className="py-2 pr-3">{row.department ?? '—'}</td>
                <td className="py-2 pr-3">{row.provenance}</td>
                <td className="py-2">
                  {new Date(row.scrapedAt).toLocaleDateString('fr-FR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
