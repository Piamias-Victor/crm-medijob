import { z } from 'zod'
import { router, protectedProcedure } from '@/server/trpc'
import { contactRepository } from '@/server/db/repositories/contact.repository'
import { missionRepository } from '@/server/db/repositories/mission.repository'
import { listContactMissions } from '@/server/read-models/contact-missions'
import { listPharmacyPickerOptions } from '@/server/read-models/pharmacy-picker'
import { toContactListRow } from '@/view-models/contact-list'
import { toContactDetail } from '@/view-models/contact-detail'
import { contactInputSchema, updateContactSchema } from '@/view-models/contact-form.schema'
import { groupContactsByPharmacy } from '@/view-models/contact-by-pharmacy'
import { mapContactPharmacyPickerRows } from '@/view-models/contact-pharmacy-picker'
import { toContactPrimaryName } from '@/view-models/contact-primary-warning'
import { toContactCreateData, type ContactDeps } from '@/server/routers/contact.deps'
import { idSchema } from '@/lib/schemas/entity-id'

export type { ContactDeps } from '@/server/routers/contact.deps'

const pharmacyIdSchema = z.object({ pharmacyId: z.string().min(1) })
const primaryByPharmacySchema = pharmacyIdSchema.extend({
  excludeContactId: z.string().min(1).optional(),
})
const pharmacyIdsSchema = z.object({ pharmacyIds: z.array(z.string().min(1)) })

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
      mapContactPharmacyPickerRows(await deps.contacts.listByPharmacy(input.pharmacyId)),
    ),
    primaryByPharmacy: protectedProcedure.input(primaryByPharmacySchema).query(async ({ input }) => {
      const primary = await deps.contacts.findPrimaryByPharmacy(
        input.pharmacyId,
        input.excludeContactId,
      )
      const fullName = primary ? toContactPrimaryName(primary) : null
      return fullName ? { fullName } : null
    }),
    listByPharmacyIds: protectedProcedure.input(pharmacyIdsSchema).query(async ({ input }) =>
      groupContactsByPharmacy(await deps.contacts.listByPharmacyIds(input.pharmacyIds)),
    ),
    create: protectedProcedure.input(contactInputSchema).mutation(async ({ input }) => {
      const contact = await deps.contacts.create(toContactCreateData(input))
      return { id: contact.id }
    }),
    update: protectedProcedure
      .input(updateContactSchema)
      .mutation(({ input }) => deps.contacts.update(input.id, toContactCreateData(input.data))),
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
