import { z } from 'zod'
import { router, protectedProcedure, permissionProcedure } from '@/server/trpc'
import { toPharmacyListRow } from '@/view-models/pharmacy-list'
import { toPharmacyDetail } from '@/view-models/pharmacy-detail'
import { toPharmacyQuickViewEntity } from '@/view-models/pharmacy-quick-view-entity'
import { toPharmacyQuickView } from '@/view-models/pharmacy-quick-view'
import { toPharmacyUpdateData } from '@/view-models/pharmacy-update'
import {
  pharmacyInputSchema,
  updatePharmacySchema,
  searchSiretSchema,
} from '@/view-models/pharmacy-form.schema'
import { pharmacyListFiltersSchema } from '@/view-models/pharmacy-list-filters.schema'
import { idSchema } from '@/lib/schemas/entity-id'
import type { PharmacyDeps } from '@/server/routers/pharmacy.deps'

export type { PharmacyDeps } from '@/server/routers/pharmacy.deps'

const nameSchema = z.object({ name: z.string().trim().min(1) })

export function makePharmacyRouter(deps: PharmacyDeps) {
  return router({
    list: protectedProcedure.input(pharmacyListFiltersSchema.optional()).query(async ({ input }) =>
      (await deps.pharmacies.list(input)).map(toPharmacyListRow),
    ),
    getById: protectedProcedure.input(idSchema).query(async ({ input }) => {
      const pharmacy = await deps.pharmacies.findDetailById(input.id)
      return pharmacy ? toPharmacyDetail(pharmacy) : null
    }),
    quickView: protectedProcedure.input(idSchema).query(async ({ input }) => {
      const row = await deps.pharmacies.findQuickViewById(input.id)
      return row ? toPharmacyQuickView(toPharmacyQuickViewEntity(row)) : null
    }),
    referentials: protectedProcedure.query(async () => ({
      groupements: await deps.referentials.listGroupements(),
      softwares: await deps.referentials.listSoftwares(),
      recruiters: await deps.referentials.listRecruiters(),
    })),
    create: protectedProcedure
      .input(pharmacyInputSchema)
      .mutation(async ({ ctx, input }) => {
        const row = await deps.pharmacies.create(toPharmacyUpdateData(input))
        await deps.logLifecycle({
          action: 'created',
          entityType: 'PHARMACY',
          entityId: row.id,
          user: ctx.session.user,
        })
        return row
      }),
    update: protectedProcedure
      .input(updatePharmacySchema)
      .mutation(async ({ ctx, input }) => {
        const row = await deps.pharmacies.update(input.id, toPharmacyUpdateData(input.data))
        await deps.logLifecycle({
          action: 'updated',
          entityType: 'PHARMACY',
          entityId: input.id,
          user: ctx.session.user,
        })
        return row
      }),
    softDelete: permissionProcedure('softDelete')
      .input(idSchema)
      .mutation(async ({ input }) => deps.pharmacies.softDelete(input.id)),
    searchSiret: protectedProcedure
      .input(searchSiretSchema)
      .query(({ input }) => deps.searchSiret(input.query)),
    createGroupement: protectedProcedure
      .input(nameSchema)
      .mutation(async ({ input }) => deps.createGroupement(input.name)),
    createSoftware: protectedProcedure
      .input(nameSchema)
      .mutation(async ({ input }) => deps.createSoftware(input.name)),
  })
}
