import { z } from 'zod'
import type { Prisma } from '@prisma/client'
import { router, protectedProcedure } from '@/server/trpc'
import { pharmacyRepository } from '@/server/db/repositories/pharmacy.repository'
import { groupementRepository } from '@/server/db/repositories/groupement.repository'
import { softwareRepository } from '@/server/db/repositories/software.repository'
import { searchSiret as searchSiretService, type SiretResult } from '@/server/services/siret'
import { toPharmacyListRow, type PharmacyListEntity } from '@/view-models/pharmacy-list'
import { toPharmacyDetail, type PharmacyDetailEntity } from '@/view-models/pharmacy-detail'
import { toPharmacyUpdateData } from '@/view-models/pharmacy-update'
import {
  pharmacyInputSchema,
  updatePharmacySchema,
  searchSiretSchema,
} from '@/view-models/pharmacy-form.schema'

type Ref = { id: string; name: string }
type CreatedPharmacy = { id: string }

export type PharmacyDeps = {
  pharmacies: {
    list: () => Promise<PharmacyListEntity[]>
    findDetailById: (id: string) => Promise<PharmacyDetailEntity | null>
    create: (data: Prisma.PharmacyUncheckedCreateInput) => Promise<CreatedPharmacy>
    update: (id: string, data: Prisma.PharmacyUncheckedUpdateInput) => Promise<unknown>
    softDelete: (id: string) => Promise<unknown>
  }
  referentials: { listGroupements: () => Promise<Ref[]>; listSoftwares: () => Promise<Ref[]> }
  createGroupement: (name: string) => Promise<Ref>
  createSoftware: (name: string) => Promise<Ref>
  searchSiret: (query: string) => Promise<SiretResult[]>
}

import { idSchema } from '@/lib/schemas/entity-id'
const nameSchema = z.object({ name: z.string().trim().min(1) })

export function makePharmacyRouter(deps: PharmacyDeps) {
  return router({
    list: protectedProcedure.query(async () =>
      (await deps.pharmacies.list()).map(toPharmacyListRow),
    ),
    getById: protectedProcedure.input(idSchema).query(async ({ input }) => {
      const pharmacy = await deps.pharmacies.findDetailById(input.id)
      return pharmacy ? toPharmacyDetail(pharmacy) : null
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
    softDelete: protectedProcedure
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
    list: () => pharmacyRepository.list(),
    findDetailById: (id) => pharmacyRepository.findDetailById(id),
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
