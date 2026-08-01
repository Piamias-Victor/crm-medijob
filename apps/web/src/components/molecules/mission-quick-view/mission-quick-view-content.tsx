import { Briefcase, Building2, History, MapPin, UserRound } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { MissionStatusBadge } from '@/components/molecules/MissionStatusBadge'
import { QuickViewFieldRow } from '@/components/molecules/quick-view-panel/quick-view-field-row'
import { QuickViewSection } from '@/components/molecules/quick-view-panel/quick-view-section'
import {
  MISSION_QUICK_VIEW_EMPTY,
  MISSION_QUICK_VIEW_SECTIONS,
} from '@/components/molecules/mission-quick-view/mission-quick-view-copy'
import { CONTRACT_TYPE_LABELS } from '@/lib/candidate-options'
import type { MissionQuickViewPayload } from '@/view-models/mission-quick-view.types'

export function MissionQuickViewContent({ view }: { view: MissionQuickViewPayload }) {
  const locality = [view.coordinates.postalCode, view.coordinates.city]
    .filter(Boolean)
    .join(' ')
  const last = view.lastAction

  return (
    <div className="flex flex-col gap-5">
      <QuickViewSection title={MISSION_QUICK_VIEW_SECTIONS.status} icon={Briefcase}>
        <div className="flex flex-wrap items-center gap-2">
          <MissionStatusBadge status={view.status} />
          <Badge variant="sky">{CONTRACT_TYPE_LABELS[view.contractType]}</Badge>
        </div>
        <QuickViewFieldRow icon={Briefcase}>{view.jobTitleName}</QuickViewFieldRow>
        <QuickViewFieldRow icon={UserRound}>
          {view.referentName ?? MISSION_QUICK_VIEW_EMPTY.referent}
        </QuickViewFieldRow>
      </QuickViewSection>
      <QuickViewSection title={MISSION_QUICK_VIEW_SECTIONS.pharmacy} icon={Building2}>
        <QuickViewFieldRow icon={Building2}>{view.pharmacyName}</QuickViewFieldRow>
      </QuickViewSection>
      <QuickViewSection title={MISSION_QUICK_VIEW_SECTIONS.coordinates} icon={MapPin}>
        <QuickViewFieldRow icon={MapPin}>
          <div className="space-y-0.5">
            {view.coordinates.address ? (
              <p className="font-medium">{view.coordinates.address}</p>
            ) : null}
            <p className="text-fg-muted">{locality || MISSION_QUICK_VIEW_EMPTY.field}</p>
          </div>
        </QuickViewFieldRow>
      </QuickViewSection>
      <QuickViewSection title={MISSION_QUICK_VIEW_SECTIONS.lastAction} icon={History}>
        {last ? (
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="sky">{last.typeLabel}</Badge>
              <span className="text-xs text-fg-muted">{last.dateLabel}</span>
              <span className="text-xs text-fg-muted">· {last.authorName}</span>
            </div>
            {last.content ? (
              <p className="text-sm leading-relaxed text-fg">{last.content}</p>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-fg-muted">{MISSION_QUICK_VIEW_EMPTY.lastAction}</p>
        )}
      </QuickViewSection>
    </div>
  )
}
