import { Briefcase, Building2, Mail, Phone, Star } from 'lucide-react'
import { QuickViewFieldRow } from '@/components/molecules/quick-view-panel/quick-view-field-row'
import { QuickViewSection } from '@/components/molecules/quick-view-panel/quick-view-section'
import {
  CONTACT_QUICK_VIEW_EMPTY,
  CONTACT_QUICK_VIEW_SECTIONS,
} from '@/components/molecules/contact-quick-view/contact-quick-view-copy'
import type { ContactQuickViewPayload } from '@/view-models/contact-quick-view.types'

export function ContactQuickViewContent({ view }: { view: ContactQuickViewPayload }) {
  return (
    <div className="flex flex-col gap-5">
      <QuickViewSection title={CONTACT_QUICK_VIEW_SECTIONS.identity} icon={Briefcase}>
        <QuickViewFieldRow icon={Briefcase}>{view.roleName}</QuickViewFieldRow>
        {view.isPrimary ? (
          <QuickViewFieldRow icon={Star}>Contact principal</QuickViewFieldRow>
        ) : null}
      </QuickViewSection>
      <QuickViewSection title={CONTACT_QUICK_VIEW_SECTIONS.pharmacy} icon={Building2}>
        <QuickViewFieldRow icon={Building2}>{view.pharmacyName}</QuickViewFieldRow>
        <p className="text-sm text-fg-muted">{view.city ?? CONTACT_QUICK_VIEW_EMPTY.field}</p>
      </QuickViewSection>
      <QuickViewSection title={CONTACT_QUICK_VIEW_SECTIONS.coords} icon={Phone}>
        <QuickViewFieldRow icon={Phone}>
          {view.phone ?? CONTACT_QUICK_VIEW_EMPTY.field}
        </QuickViewFieldRow>
        <QuickViewFieldRow icon={Mail}>
          {view.email ?? CONTACT_QUICK_VIEW_EMPTY.field}
        </QuickViewFieldRow>
      </QuickViewSection>
    </div>
  )
}
