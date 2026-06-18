import type { Contact } from '@prisma/client'
import type { ContactInput } from '@/view-models/contact-form.schema'

export function toContactFormValues(contact: Contact): Partial<ContactInput> {
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
