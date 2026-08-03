import type { Prisma } from '@prisma/client'
import type { z } from 'zod'
import type { LogEntityLifecycle } from '@/server/activity-log/log-entity-lifecycle'
import type { listContactMissions } from '@/server/read-models/contact-missions'
import type { ContactListEntity } from '@/view-models/contact-list'
import type { ContactListFilters } from '@/view-models/contact-list-filters.schema'
import type { ContactDetailEntity } from '@/view-models/contact-detail'
import type { ContactQuickViewEntity } from '@/view-models/contact-quick-view.types'
import type { contactInputSchema } from '@/view-models/contact-form.schema'
import { toReferentIdOrNull } from '@/view-models/optional-referent-id.schema'

type PharmacyRef = { id: string; name: string }
type ContactRoleRef = { id: string; name: string }
export type CreatedContact = { id: string }

export type ContactDeps = {
  contacts: {
    list: (filters?: ContactListFilters) => Promise<ContactListEntity[]>
    findById: (id: string) => Promise<ContactDetailEntity | null>
    listByPharmacy: (
      pharmacyId: string,
    ) => Promise<
      { id: string; firstName: string; lastName: string; email: string | null; isPrimary: boolean }[]
    >
    findPrimaryByPharmacy: (
      pharmacyId: string,
      excludeContactId?: string,
    ) => Promise<{ firstName: string; lastName: string } | null>
    listByPharmacyIds: (
      pharmacyIds: string[],
    ) => Promise<{ id: string; firstName: string; lastName: string; pharmacyId: string }[]>
    create: (data: Prisma.ContactUncheckedCreateInput) => Promise<CreatedContact>
    update: (id: string, data: Prisma.ContactUncheckedUpdateInput) => Promise<unknown>
    setPrimary: (id: string) => Promise<ContactDetailEntity | null>
    softDelete: (id: string) => Promise<unknown>
    findQuickViewById: (id: string) => Promise<ContactQuickViewEntity | null>
  }
  listMissions: (contactId: string) => ReturnType<typeof listContactMissions>
  pharmacies: { listForPicker: () => Promise<PharmacyRef[]> }
  contactRoles: { list: () => Promise<ContactRoleRef[]> }
  logLifecycle: LogEntityLifecycle
}

export function toContactCreateData(
  input: z.output<typeof contactInputSchema>,
): Prisma.ContactUncheckedCreateInput {
  return {
    pharmacyId: input.pharmacyId,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
    contactRoleId: input.contactRoleId,
    isPrimary: input.isPrimary,
    notes: input.notes,
    referentId: toReferentIdOrNull(input.referentId),
  }
}
