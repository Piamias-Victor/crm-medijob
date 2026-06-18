import type { ContactDetailPayload } from '@/view-models/contact-detail.types'
import type { ContactInput } from '@/view-models/contact-form.schema'

export function toContactFormValues(contact: ContactDetailPayload): Partial<ContactInput> {
  return {
    pharmacyId: contact.pharmacyId,
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email ?? undefined,
    phone: contact.phone ?? undefined,
    role: contact.role,
    isPrimary: contact.isPrimary,
    notes: contact.notes ?? undefined,
  }
}
