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
    <div className="rounded-lg border border-border/50 bg-white/60 p-4 backdrop-blur-sm">
      <p className="text-sm leading-relaxed text-fg-muted">
        Pour chaque métier de mission, réglez la compatibilité avec chaque métier candidat.
        <span className="text-fg"> 0 %</span> exclut le couple du matching ;
        <span className="text-fg"> 100 %</span> indique une adéquation parfaite.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {LEGEND.map(({ score, label }) => (
          <span
            key={label}
            className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', compatibilityScoreStyle(score))}
          >
            {label} · {score} %
          </span>
        ))}
      </div>
    </div>
  )
}
