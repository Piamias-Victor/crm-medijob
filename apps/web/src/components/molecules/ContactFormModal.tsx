'use client'

import { GlassModal } from '@/components/molecules/GlassModal'
import { ContactForm } from '@/components/molecules/ContactForm'
import type { ContactInput } from '@/view-models/contact-form.schema'

type Ref = { id: string; name: string }

type Props = {
  open: boolean
  submitting: boolean
  pharmacies: Ref[]
  onClose: () => void
  onSubmit: (data: ContactInput) => void
}

export function ContactFormModal({ open, submitting, pharmacies, onClose, onSubmit }: Props) {
  return (
    <GlassModal
      open={open}
      onClose={onClose}
      title="Nouveau contact"
      description="Ajoutez un interlocuteur rattaché à une officine."
    >
      <ContactForm pharmacies={pharmacies} submitting={submitting} onSubmit={onSubmit} />
    </GlassModal>
  )
}
