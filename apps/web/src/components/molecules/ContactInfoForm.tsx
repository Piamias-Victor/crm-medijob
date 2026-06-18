'use client'

import type { ContactDetail } from '@/server/routers/contact'
import type { ContactInput } from '@/view-models/contact-form.schema'
import { toContactFormValues } from '@/view-models/contact-form'
import { ContactForm } from '@/components/molecules/ContactForm'

type Ref = { id: string; name: string }

type Props = {
  contact: ContactDetail
  pharmacies: Ref[]
  submitting: boolean
  onSubmit: (data: ContactInput) => void
}

export function ContactInfoForm({ contact, pharmacies, submitting, onSubmit }: Props) {
  return (
    <ContactForm
      key={contact.id + contact.updatedAt.toISOString()}
      defaultValues={toContactFormValues(contact)}
      pharmacies={pharmacies}
      submitting={submitting}
      onSubmit={onSubmit}
      layout="detail"
    />
  )
}
