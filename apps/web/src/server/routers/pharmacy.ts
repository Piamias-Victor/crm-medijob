import { z } from 'zod'
import type { Prisma, Pharmacy } from '@prisma/client'
import { router, protectedProcedure } from '@/server/trpc'
import { pharmacyRepository } from '@/server/db/repositories/pharmacy.repository'
import { groupementRepository } from '@/server/db/repositories/groupement.repository'
import { softwareRepository } from '@/server/db/repositories/software.repository'
import { searchSiret as searchSiretService, type SiretResult } from '@/server/services/siret'
import { computeNumeroTVA } from '@/lib/tva'
import { toPharmacyListRow, type PharmacyListEntity } from '@/view-models/pharmacy-list'
import {
  pharmacyInputSchema,
  updatePharmacySchema,
  searchSiretSchema,
} from '@/server/routers/pharmacy.schema'

type Ref = { id: string; name: string }

export type PharmacyDeps = {
  pharmacies: {
    list: () => Promise<PharmacyListEntity[]>
    findById: (id: string) => Promise<Pharmacy | null>
    create: (data: Prisma.PharmacyUncheckedCreateInput) => Promise<unknown>
    update: (id: string, data: Prisma.PharmacyUncheckedUpdateInput) => Promise<unknown>
    softDelete: (id: string) => Promise<unknown>
  }
  groupements: { list: () => Promise<Ref[]>; create: (name: string) => Promise<Ref> }
  softwares: { list: () => Promise<Ref[]>; create: (name: string) => Promise<Ref> }
  searchSiret: (query: string) => Promise<SiretResult[]>
}

type PharmacyData = z.output<typeof pharmacyInputSchema>

function toData(input: PharmacyData): Prisma.PharmacyUncheckedCreateInput {
  const numeroTVA = input.siret
    ? (computeNumeroTVA(input.siret) ?? input.numeroTVA)
    : input.numeroTVA
  return { ...input, numeroTVA }
}

const idSchema = z.object({ id: z.string().min(1) })
const nameSchema = z.object({ name: z.string().trim().min(1) })

export function makePharmacyRouter(deps: PharmacyDeps) {
  return router({
    list: protectedProcedure.query(async () =>
      (await deps.pharmacies.list()).map(toPharmacyListRow),
    ),
    getById: protectedProcedure
      .input(idSchema)
      .query(({ input }) => deps.pharmacies.findById(input.id)),
    referentials: protectedProcedure.query(async () => ({
      groupements: await deps.groupements.list(),
      softwares: await deps.softwares.list(),
    })),
    create: protectedProcedure
      .input(pharmacyInputSchema)
      .mutation(({ input }) => deps.pharmacies.create(toData(input))),
    update: protectedProcedure
      .input(updatePharmacySchema)
      .mutation(({ input }) => deps.pharmacies.update(input.id, toData(input.data))),
    softDelete: protectedProcedure
      .input(idSchema)
      .mutation(({ input }) => deps.pharmacies.softDelete(input.id)),
    searchSiret: protectedProcedure
      .input(searchSiretSchema)
      .query(({ input }) => deps.searchSiret(input.query)),
    createGroupement: protectedProcedure
      .input(nameSchema)
      .mutation(({ input }) => deps.groupements.create(input.name)),
    createSoftware: protectedProcedure
      .input(nameSchema)
      .mutation(({ input }) => deps.softwares.create(input.name)),
  })
}

export const pharmacyRouter = makePharmacyRouter({
  pharmacies: pharmacyRepository,
  groupements: {
    list: () => groupementRepository.list(),
    create: (name) => groupementRepository.create({ name }),
  },
  softwares: {
    list: () => softwareRepository.list(),
    create: (name) => softwareRepository.create({ name }),
  },
  searchSiret: (query) => searchSiretService(query),
})
