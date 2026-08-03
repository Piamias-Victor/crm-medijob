import { Mail, MapPin, Phone } from 'lucide-react'
import { QuickViewFieldRow } from '@/components/molecules/quick-view-panel/quick-view-field-row'
import { QuickViewSection } from '@/components/molecules/quick-view-panel/quick-view-section'
import {
  PHARMACY_QUICK_VIEW_EMPTY,
  PHARMACY_QUICK_VIEW_SECTIONS,
} from '@/components/molecules/pharmacy-quick-view/pharmacy-quick-view-copy'
import type { PharmacyQuickViewCoordinates } from '@/view-models/pharmacy-quick-view.types'

type Props = { coordinates: PharmacyQuickViewCoordinates }

function cityLine(postalCode: string | null, city: string | null): string | null {
  const parts = [postalCode, city].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : null
}

export function PharmacyQuickViewCoords({ coordinates }: Props) {
  const { address, postalCode, city, phone, email } = coordinates
  const locality = cityLine(postalCode, city)
  const hasLocation = Boolean(address || locality)

  return (
    <QuickViewSection title={PHARMACY_QUICK_VIEW_SECTIONS.coordinates} icon={MapPin}>
      {hasLocation ? (
        <QuickViewFieldRow icon={MapPin}>
          <div className="space-y-0.5">
            {address ? <p className="font-medium">{address}</p> : null}
            {locality && locality !== address ? (
              <p className="text-fg-muted">{locality}</p>
            ) : null}
          </div>
        </QuickViewFieldRow>
      ) : (
        <p className="text-sm text-fg-muted">{PHARMACY_QUICK_VIEW_EMPTY.field}</p>
      )}
      {phone ? (
        <QuickViewFieldRow icon={Phone}>
          <a href={`tel:${phone}`} className="font-medium hover:text-accent">
            {phone}
          </a>
        </QuickViewFieldRow>
      ) : null}
      {email ? (
        <QuickViewFieldRow icon={Mail}>
          <a href={`mailto:${email}`} className="font-medium hover:text-accent">
            {email}
          </a>
        </QuickViewFieldRow>
      ) : null}
    </QuickViewSection>
  )
}
