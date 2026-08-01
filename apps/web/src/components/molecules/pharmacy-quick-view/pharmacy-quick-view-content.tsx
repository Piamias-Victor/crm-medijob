import { QuickViewSection } from '@/components/molecules/quick-view-panel/quick-view-section'
import { PharmacyQuickViewCoords } from '@/components/molecules/pharmacy-quick-view/pharmacy-quick-view-coords'
import {
  PHARMACY_QUICK_VIEW_EMPTY,
  PHARMACY_QUICK_VIEW_SECTIONS,
} from '@/components/molecules/pharmacy-quick-view/pharmacy-quick-view-copy'
import { STATUS_LABELS } from '@/lib/mission-options'
import type { PharmacyQuickViewPayload } from '@/view-models/pharmacy-quick-view.types'

type Props = { view: PharmacyQuickViewPayload }

export function PharmacyQuickViewContent({ view }: Props) {
  return (
    <div className="space-y-5">
      <PharmacyQuickViewCoords coordinates={view.coordinates} />
      <QuickViewSection title={PHARMACY_QUICK_VIEW_SECTIONS.contacts}>
        {view.primaryContacts.length === 0 ? (
          <p className="text-muted">{PHARMACY_QUICK_VIEW_EMPTY.contacts}</p>
        ) : (
          <ul className="space-y-2">
            {view.primaryContacts.map((c) => (
              <li key={c.id}>
                <p className="font-medium">{c.fullName}</p>
                <p className="text-muted">{c.email ?? c.phone ?? PHARMACY_QUICK_VIEW_EMPTY.field}</p>
              </li>
            ))}
          </ul>
        )}
      </QuickViewSection>
      <QuickViewSection title={PHARMACY_QUICK_VIEW_SECTIONS.needs}>
        {view.openNeeds.length === 0 ? (
          <p className="text-muted">{PHARMACY_QUICK_VIEW_EMPTY.needs}</p>
        ) : (
          <ul className="space-y-2">
            {view.openNeeds.map((n) => (
              <li key={n.id}>
                {n.title} · {n.jobTitle} · {STATUS_LABELS[n.status]}
              </li>
            ))}
          </ul>
        )}
      </QuickViewSection>
      <QuickViewSection title={PHARMACY_QUICK_VIEW_SECTIONS.lastAction}>
        {view.lastAction ? (
          <p>
            {view.lastAction.typeLabel} · {view.lastAction.dateLabel} · {view.lastAction.authorName}
            {view.lastAction.content ? ` — ${view.lastAction.content}` : ''}
          </p>
        ) : (
          <p className="text-muted">{PHARMACY_QUICK_VIEW_EMPTY.lastAction}</p>
        )}
      </QuickViewSection>
    </div>
  )
}
