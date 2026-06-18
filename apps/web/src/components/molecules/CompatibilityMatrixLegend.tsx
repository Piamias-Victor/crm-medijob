import { cn } from '@/lib/cn'
import { compatibilityScoreStyle } from '@/view-models/compatibility-score-style'

const LEGEND = [
  { score: 0, label: 'Exclu' },
  { score: 30, label: 'Faible' },
  { score: 60, label: 'Partiel' },
  { score: 100, label: 'Parfait' },
] as const

export function CompatibilityMatrixLegend() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border/80 bg-surface/80 p-4">
      <p className="text-sm leading-relaxed text-fg-muted">
        Pour chaque <strong className="font-medium text-fg">métier de mission</strong> (ligne),
        définissez le taux de compatibilité avec chaque{' '}
        <strong className="font-medium text-fg">métier candidat</strong> (colonne).{' '}
        <span className="text-fg">0 % exclut</span> le couple du pré-filtrage ;{' '}
        <span className="text-fg">100 %</span> correspond à une adéquation parfaite pour le
        matching.
      </p>
      <div className="flex flex-wrap gap-2">
        {LEGEND.map(({ score, label }) => (
          <span
            key={label}
            className={cn(
              'rounded-full px-2.5 py-0.5 text-xs font-medium',
              compatibilityScoreStyle(score),
            )}
          >
            {label} · {score} %
          </span>
        ))}
      </div>
    </div>
  )
}
