import { History } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { QuickViewSection } from '@/components/molecules/quick-view-panel/quick-view-section'
import {
  PHARMACY_QUICK_VIEW_EMPTY,
  PHARMACY_QUICK_VIEW_SECTIONS,
} from '@/components/molecules/pharmacy-quick-view/pharmacy-quick-view-copy'
import type { PharmacyQuickViewLastAction } from '@/view-models/pharmacy-quick-view.types'

type Props = { lastAction: PharmacyQuickViewLastAction | null }

export function PharmacyQuickViewLastActionBlock({ lastAction }: Props) {
  return (
    <QuickViewSection title={PHARMACY_QUICK_VIEW_SECTIONS.lastAction} icon={History}>
      {lastAction ? (
        <div className="space-y-2 rounded-lg border border-border/50 bg-white/60 px-3 py-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="sky">{lastAction.typeLabel}</Badge>
            <span className="text-xs text-fg-muted">{lastAction.dateLabel}</span>
            <span className="text-xs text-fg-muted">· {lastAction.authorName}</span>
          </div>
          {lastAction.content ? (
            <p className="text-sm leading-relaxed text-fg">{lastAction.content}</p>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-fg-muted">{PHARMACY_QUICK_VIEW_EMPTY.lastAction}</p>
      )}
    </QuickViewSection>
  )
}
