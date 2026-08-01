import { z } from 'zod'
import { router, protectedProcedure, permissionProcedure } from '@/server/trpc'
import { toContactListRow } from '@/view-models/contact-list'
import { toContactDetail } from '@/view-models/contact-detail'
import { toContactQuickView } from '@/view-models/contact-quick-view'
import { contactInputSchema, updateContactSchema } from '@/view-models/contact-form.schema'
import { groupContactsByPharmacy } from '@/view-models/contact-by-pharmacy'
import { mapContactPharmacyPickerRows } from '@/view-models/contact-pharmacy-picker'
import { toContactPrimaryName } from '@/view-models/contact-primary-warning'
import { toContactCreateData, type ContactDeps } from '@/server/routers/contact.deps'
import { idSchema } from '@/lib/schemas/entity-id'
import { contactListFiltersSchema } from '@/view-models/contact-list-filters.schema'

export type { ContactDeps } from '@/server/routers/contact.deps'

const pharmacyIdSchema = z.object({ pharmacyId: z.string().min(1) })
const primaryByPharmacySchema = pharmacyIdSchema.extend({
  excludeContactId: z.string().min(1).optional(),
})
const pharmacyIdsSchema = z.object({ pharmacyIds: z.array(z.string().min(1)) })

export function makeContactRouter(deps: ContactDeps) {
  return router({
    list: protectedProcedure.input(contactListFiltersSchema.optional()).query(async ({ input }) =>
      (await deps.contacts.list(input)).map(toContactListRow),
    ),
    getById: protectedProcedure.input(idSchema).query(async ({ input }) => {
      const contact = await deps.contacts.findById(input.id)
      return contact ? toContactDetail(contact) : null
    }),
    quickView: protectedProcedure.input(idSchema).query(async ({ input }) => {
      const row = await deps.contacts.findQuickViewById(input.id)
      return row ? toContactQuickView(row) : null
    }),
    /** @deprecated Use `referentials` — kept for existing callers during migration */
    pharmacyOptions: protectedProcedure.query(() => deps.pharmacies.listForPicker()),
    referentials: protectedProcedure.query(async () => ({
      pharmacies: await deps.pharmacies.listForPicker(),
      contactRoles: await deps.contactRoles.list(),
    })),
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
    create: protectedProcedure.input(contactInputSchema).mutation(async ({ ctx, input }) => {
      const contact = await deps.contacts.create(toContactCreateData(input))
      await deps.logLifecycle({
        action: 'created',
        entityType: 'CONTACT',
        entityId: contact.id,
        user: ctx.session.user,
      })
      return { id: contact.id }
    }),
    update: protectedProcedure.input(updateContactSchema).mutation(async ({ ctx, input }) => {
      const row = await deps.contacts.update(input.id, toContactCreateData(input.data))
      await deps.logLifecycle({
        action: 'updated',
        entityType: 'CONTACT',
        entityId: input.id,
        user: ctx.session.user,
      })
      return row
    }),
    setPrimary: protectedProcedure.input(idSchema).mutation(async ({ input }) => {
      const contact = await deps.contacts.setPrimary(input.id)
      return contact ? toContactDetail(contact) : null
    }),
    missions: protectedProcedure.input(idSchema).query(({ input }) => deps.listMissions(input.id)),
    softDelete: permissionProcedure('softDelete')
      .input(idSchema)
      .mutation(({ input }) => deps.contacts.softDelete(input.id)),
  })
}
