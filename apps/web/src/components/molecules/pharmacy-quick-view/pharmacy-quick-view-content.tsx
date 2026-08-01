import { PharmacyQuickViewCoords } from '@/components/molecules/pharmacy-quick-view/pharmacy-quick-view-coords'
import { PharmacyQuickViewContacts } from '@/components/molecules/pharmacy-quick-view/pharmacy-quick-view-contacts'
import { PharmacyQuickViewNeeds } from '@/components/molecules/pharmacy-quick-view/pharmacy-quick-view-needs'
import { PharmacyQuickViewLastActionBlock } from '@/components/molecules/pharmacy-quick-view/pharmacy-quick-view-last-action'
import type { PharmacyQuickViewPayload } from '@/view-models/pharmacy-quick-view.types'

type Props = { view: PharmacyQuickViewPayload }

export function PharmacyQuickViewContent({ view }: Props) {
  return (
    <div className="space-y-3">
      <PharmacyQuickViewCoords coordinates={view.coordinates} />
      <PharmacyQuickViewContacts contacts={view.primaryContacts} />
      <PharmacyQuickViewNeeds needs={view.openNeeds} />
      <PharmacyQuickViewLastActionBlock lastAction={view.lastAction} />
    </div>
  )
}
