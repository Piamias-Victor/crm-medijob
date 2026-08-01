import { Briefcase, Euro, MapPin, Calendar, Users } from 'lucide-react'
import { CandidateStatusBadge } from '@/components/molecules/CandidateStatusBadge'
import { QuickViewFieldRow } from '@/components/molecules/quick-view-panel/quick-view-field-row'
import { QuickViewSection } from '@/components/molecules/quick-view-panel/quick-view-section'
import {
  CANDIDATE_QUICK_VIEW_EMPTY,
  CANDIDATE_QUICK_VIEW_SECTIONS,
} from '@/components/molecules/candidate-quick-view/candidate-quick-view-copy'
import type { CandidateQuickViewPayload } from '@/view-models/candidate-quick-view.types'

function salaryLabel(view: CandidateQuickViewPayload): string {
  if (view.salaryExpectations) return view.salaryExpectations
  if (view.salaryMin != null || view.salaryMax != null) {
    return `${view.salaryMin ?? '—'} – ${view.salaryMax ?? '—'} €`
  }
  return CANDIDATE_QUICK_VIEW_EMPTY.field
}

export function CandidateQuickViewContent({ view }: { view: CandidateQuickViewPayload }) {
  return (
    <div className="flex flex-col gap-5">
      <QuickViewSection title={CANDIDATE_QUICK_VIEW_SECTIONS.identity} icon={Briefcase}>
        <QuickViewFieldRow icon={Briefcase}>{view.jobTitle}</QuickViewFieldRow>
        <CandidateStatusBadge status={view.effectiveStatus} />
        <p className="text-sm text-fg-muted">{view.referentName ?? CANDIDATE_QUICK_VIEW_EMPTY.field}</p>
      </QuickViewSection>
      <QuickViewSection title={CANDIDATE_QUICK_VIEW_SECTIONS.mobility} icon={MapPin}>
        <QuickViewFieldRow icon={MapPin}>
          {[view.city, view.postalCode].filter(Boolean).join(' ') || CANDIDATE_QUICK_VIEW_EMPTY.field}
        </QuickViewFieldRow>
        <p className="text-sm text-fg-muted">
          Mobilité {view.mobilityRadiusKm != null ? `${view.mobilityRadiusKm} km` : '—'}
        </p>
        <QuickViewFieldRow icon={Calendar}>{view.availabilityLabel}</QuickViewFieldRow>
      </QuickViewSection>
      <QuickViewSection title={CANDIDATE_QUICK_VIEW_SECTIONS.salary} icon={Euro}>
        <QuickViewFieldRow icon={Euro}>{salaryLabel(view)}</QuickViewFieldRow>
      </QuickViewSection>
      <QuickViewSection title={CANDIDATE_QUICK_VIEW_SECTIONS.missions} icon={Users}>
        {view.activeMissions.length === 0 ? (
          <p className="text-sm text-fg-muted">{CANDIDATE_QUICK_VIEW_EMPTY.field}</p>
        ) : (
          view.activeMissions.map((mission) => (
            <p key={mission.id} className="text-sm text-fg">
              {mission.title} · {mission.stageName}
            </p>
          ))
        )}
      </QuickViewSection>
    </div>
  )
}
