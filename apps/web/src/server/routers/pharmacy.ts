import { z } from 'zod'
import { router, protectedProcedure, permissionProcedure } from '@/server/trpc'
import { pharmacyRepository } from '@/server/db/repositories/pharmacy.repository'
import { groupementRepository } from '@/server/db/repositories/groupement.repository'
import { softwareRepository } from '@/server/db/repositories/software.repository'
import { searchSiret as searchSiretService } from '@/server/services/siret'
import { findPharmacyQuickViewById } from '@/server/db/repositories/pharmacy-quick-view.repo'
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
    })),
    create: protectedProcedure
      .input(pharmacyInputSchema)
      .mutation(async ({ input }) => deps.pharmacies.create(toPharmacyUpdateData(input))),
    update: protectedProcedure
      .input(updatePharmacySchema)
      .mutation(async ({ input }) => deps.pharmacies.update(input.id, toPharmacyUpdateData(input.data))),
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

export const pharmacyRouter = makePharmacyRouter({
  pharmacies: {
    list: (filters) => pharmacyRepository.list(filters),
    findDetailById: (id) => pharmacyRepository.findDetailById(id),
    findQuickViewById: (id) => findPharmacyQuickViewById(id),
    create: (data) => pharmacyRepository.create(data),
    update: (id, data) => pharmacyRepository.update(id, data),
    softDelete: (id) => pharmacyRepository.softDelete(id),
  },
  referentials: {
    listGroupements: () => groupementRepository.list(),
    listSoftwares: () => softwareRepository.list(),
  },
  createGroupement: (name) => groupementRepository.create({ name }),
  createSoftware: (name) => softwareRepository.create({ name }),
  searchSiret: (query) => searchSiretService(query),
})
