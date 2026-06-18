'use client'

import { GlassModal } from '@/components/molecules/GlassModal'
import { ContactForm } from '@/components/molecules/ContactForm'
import type { ContactInput } from '@/view-models/contact-form.schema'

type Ref = { id: string; name: string }

type Props = {
  open: boolean
  submitting: boolean
  pharmacies: Ref[]
  defaultValues?: Partial<ContactInput>
  lockedPharmacyId?: string
  onClose: () => void
  onSubmit: (data: ContactInput) => void
}

export function ContactFormModal({
  open,
  submitting,
  pharmacies,
  defaultValues,
  lockedPharmacyId,
  onClose,
  onSubmit,
}: Props) {
  return (
    <GlassModal
      open={open}
      onClose={onClose}
      title="Nouveau contact"
      description="Ajoutez un interlocuteur rattaché à une officine."
    >
      <ContactForm
        key={lockedPharmacyId ?? 'new'}
        defaultValues={defaultValues}
        pharmacies={pharmacies}
        lockedPharmacyId={lockedPharmacyId}
        submitting={submitting}
        onSubmit={onSubmit}
      />
    </GlassModal>
  )
}
