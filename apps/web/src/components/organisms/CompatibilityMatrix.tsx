'use client'

import { CompatibilityMatrixLegend } from '@/components/molecules/CompatibilityMatrixLegend'
import { CompatibilityScoreCell } from '@/components/molecules/CompatibilityScoreCell'
import { compatibilityKey } from '@/view-models/compatibility-matrix'
import type { RefItem } from '@/view-models/referential'

type Props = {
  titles: RefItem[]
  scores: Map<string, number>
  onChange: (missionId: string, candidateId: string, score: number) => void
}

export function CompatibilityMatrix({ titles, scores, onChange }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <CompatibilityMatrixLegend />
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[36rem] border-collapse text-sm">
          <thead>
            <tr className="bg-surface/60">
              <th className="sticky left-0 z-10 bg-surface/95 p-3 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted backdrop-blur">
                Mission ↓ / Candidat →
              </th>
              {titles.map((c) => (
                <th
                  key={c.id}
                  className="min-w-[5.5rem] p-2 text-center text-xs font-semibold text-fg-muted"
                >
                  {c.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {titles.map((m) => (
              <tr key={m.id} className="border-t border-border/80">
                <th className="sticky left-0 z-10 bg-white p-3 text-left font-medium text-fg">
                  {m.name}
                </th>
                {titles.map((c) => (
                  <td key={c.id} className="p-1.5 align-middle">
                    <CompatibilityScoreCell
                      missionName={m.name}
                      candidateName={c.name}
                      score={scores.get(compatibilityKey(m.id, c.id)) ?? 0}
                      onChange={(score) => onChange(m.id, c.id, score)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
