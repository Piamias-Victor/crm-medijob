import { Briefcase } from 'lucide-react'
import { MissionStatusBadge } from '@/components/molecules/MissionStatusBadge'
import { QuickViewSection } from '@/components/molecules/quick-view-panel/quick-view-section'
import {
  PHARMACY_QUICK_VIEW_EMPTY,
  PHARMACY_QUICK_VIEW_SECTIONS,
} from '@/components/molecules/pharmacy-quick-view/pharmacy-quick-view-copy'
import type { PharmacyQuickViewNeed } from '@/view-models/pharmacy-quick-view.types'

type Props = { needs: PharmacyQuickViewNeed[] }

export function PharmacyQuickViewNeeds({ needs }: Props) {
  return (
    <QuickViewSection title={PHARMACY_QUICK_VIEW_SECTIONS.needs} icon={Briefcase}>
      {needs.length === 0 ? (
        <p className="text-sm text-fg-muted">{PHARMACY_QUICK_VIEW_EMPTY.needs}</p>
      ) : (
        <ul className="space-y-2">
          {needs.map((need) => (
            <li
              key={need.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-border/50 bg-white/60 px-3 py-2.5"
            >
              <div className="min-w-0 space-y-0.5">
                <p className="font-medium text-fg">{need.title}</p>
                <p className="text-sm text-fg-muted">{need.jobTitle}</p>
              </div>
              <MissionStatusBadge status={need.status} className="shrink-0" />
            </li>
          ))}
        </ul>
      )}
    </QuickViewSection>
  )
}
