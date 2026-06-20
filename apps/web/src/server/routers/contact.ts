import { z } from 'zod'
import type { ContactRole, Prisma } from '@prisma/client'
import { router, protectedProcedure } from '@/server/trpc'
import { contactRepository } from '@/server/db/repositories/contact.repository'
import { missionRepository } from '@/server/db/repositories/mission.repository'
import { listContactMissions } from '@/server/read-models/contact-missions'
import { listPharmacyPickerOptions } from '@/server/read-models/pharmacy-picker'
import { toContactListRow, type ContactListEntity } from '@/view-models/contact-list'
import { toContactDetail, type ContactDetailEntity } from '@/view-models/contact-detail'
import { contactInputSchema, updateContactSchema } from '@/view-models/contact-form.schema'

type PharmacyRef = { id: string; name: string }

export type ContactDeps = {
  contacts: {
    list: () => Promise<ContactListEntity[]>
    findById: (id: string) => Promise<ContactDetailEntity | null>
    listByPharmacy: (pharmacyId: string) => Promise<{ id: string; firstName: string; lastName: string }[]>
    create: (data: Prisma.ContactUncheckedCreateInput) => Promise<unknown>
    update: (id: string, data: Prisma.ContactUncheckedUpdateInput) => Promise<unknown>
    setPrimary: (id: string) => Promise<ContactDetailEntity | null>
    softDelete: (id: string) => Promise<unknown>
  }
  listMissions: (contactId: string) => ReturnType<typeof listContactMissions>
  pharmacies: { listForPicker: () => Promise<PharmacyRef[]> }
}

import { idSchema } from '@/lib/schemas/entity-id'
const pharmacyIdSchema = z.object({ pharmacyId: z.string().min(1) })

function toData(input: z.output<typeof contactInputSchema>): Prisma.ContactUncheckedCreateInput {
  return {
    pharmacyId: input.pharmacyId,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
    role: input.role as ContactRole,
    isPrimary: input.isPrimary,
    notes: input.notes,
  }
}

export function makeContactRouter(deps: ContactDeps) {
  return router({
    list: protectedProcedure.query(async () =>
      (await deps.contacts.list()).map(toContactListRow),
    ),
    getById: protectedProcedure.input(idSchema).query(async ({ input }) => {
      const contact = await deps.contacts.findById(input.id)
      return contact ? toContactDetail(contact) : null
    }),
    /** @deprecated Use `referentials` — kept for existing callers during migration */
    pharmacyOptions: protectedProcedure.query(() => deps.pharmacies.listForPicker()),
    referentials: protectedProcedure.query(() => deps.pharmacies.listForPicker()),
    listByPharmacy: protectedProcedure.input(pharmacyIdSchema).query(async ({ input }) =>
      (await deps.contacts.listByPharmacy(input.pharmacyId)).map((c) => ({
        id: c.id,
        label: `${c.firstName} ${c.lastName}`.trim(),
      })),
    ),
    create: protectedProcedure
      .input(contactInputSchema)
      .mutation(({ input }) => deps.contacts.create(toData(input))),
    update: protectedProcedure
      .input(updateContactSchema)
      .mutation(({ input }) => deps.contacts.update(input.id, toData(input.data))),
    setPrimary: protectedProcedure.input(idSchema).mutation(async ({ input }) => {
      const contact = await deps.contacts.setPrimary(input.id)
      return contact ? toContactDetail(contact) : null
    }),
    missions: protectedProcedure.input(idSchema).query(({ input }) => deps.listMissions(input.id)),
    softDelete: protectedProcedure
      .input(idSchema)
      .mutation(({ input }) => deps.contacts.softDelete(input.id)),
  })
}

export const contactRouter = makeContactRouter({
  contacts: contactRepository,
  listMissions: (contactId) =>
    listContactMissions(contactId, {
      listByContact: (id) => missionRepository.listByContact(id),
    }),
  pharmacies: { listForPicker: listPharmacyPickerOptions },
})
