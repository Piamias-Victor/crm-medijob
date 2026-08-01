import { QuickViewSection } from '@/components/molecules/quick-view-panel/quick-view-section'
import {
  PHARMACY_QUICK_VIEW_EMPTY,
  PHARMACY_QUICK_VIEW_SECTIONS,
} from '@/components/molecules/pharmacy-quick-view/pharmacy-quick-view-copy'
import type { PharmacyQuickViewCoordinates } from '@/view-models/pharmacy-quick-view.types'

function line(...parts: Array<string | null | undefined>): string {
  return parts.filter(Boolean).join(', ') || PHARMACY_QUICK_VIEW_EMPTY.field
}

type Props = { coordinates: PharmacyQuickViewCoordinates }

export function PharmacyQuickViewCoords({ coordinates }: Props) {
  const { address, postalCode, city, phone, email } = coordinates
  return (
    <QuickViewSection title={PHARMACY_QUICK_VIEW_SECTIONS.coordinates}>
      <ul className="space-y-1">
        <li>{line(address)}</li>
        <li>{line(postalCode, city)}</li>
        <li>{phone ?? PHARMACY_QUICK_VIEW_EMPTY.field}</li>
        <li>{email ?? PHARMACY_QUICK_VIEW_EMPTY.field}</li>
      </ul>
    </QuickViewSection>
  )
}
