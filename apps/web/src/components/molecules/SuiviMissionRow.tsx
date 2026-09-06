import Link from 'next/link'
import { Badge } from '@/components/atoms/Badge'
import { Euro } from 'lucide-react'
import { badakanMissionStepVariant } from '@/view-models/badakan-mission-step'
import type { SuiviMissionItem } from '@/view-models/badakan-suivi'
import { cn } from '@/lib/cn'

function AmountIcon({ hasAmount }: { hasAmount: boolean }) {
  return (
    <Euro
      className={cn(
        'size-3.5 shrink-0',
        hasAmount ? 'text-success' : 'text-fg-muted line-through opacity-70',
      )}
      aria-label={hasAmount ? 'Montant renseigné' : 'Montant manquant'}
    />
  )
}

export function SuiviMissionRow({ row }: { row: SuiviMissionItem }) {
  const staffedTone =
    row.step === 'STAFFED'
      ? row.staffingOrigin === 'badakan'
        ? 'border-l-4 border-l-success bg-success/5'
        : 'border-l-4 border-l-accent bg-accent-muted/30'
      : ''
  return (
    <li>
      <Link
        href={row.href}
        className={cn(
          'flex items-center justify-between gap-3 px-2 py-2.5 hover:bg-accent-muted/20',
          staffedTone,
        )}
      >
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-fg">{row.pharmacyName}</span>
          <span className="block truncate text-xs text-fg-muted">
            {row.jobTitleLabel} · {row.cityLabel} · {row.periodLabel}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5">
          {row.step === 'STAFFED' ? <AmountIcon hasAmount={row.hasAmount} /> : null}
          <Badge variant={badakanMissionStepVariant(row.step)}>{row.stepLabel}</Badge>
        </span>
      </Link>
    </li>
  )
}
