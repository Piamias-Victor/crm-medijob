import { z } from 'zod'
import type { ContactRole, Prisma } from '@prisma/client'
import { router, protectedProcedure } from '@/server/trpc'
import { contactRepository } from '@/server/db/repositories/contact.repository'
import { pharmacyRepository } from '@/server/db/repositories/pharmacy.repository'
import { toContactListRow, type ContactListEntity } from '@/view-models/contact-list'
import { contactInputSchema, updateContactSchema } from '@/view-models/contact-form.schema'
import type { ContactMissionRow } from '@/components/molecules/ContactMissionsTab'

type PharmacyRef = { id: string; name: string }

export type ContactDetail = Prisma.ContactGetPayload<{
  include: { pharmacy: { select: { id: true; name: true } } }
}>

export type ContactDeps = {
  contacts: {
    list: () => Promise<ContactListEntity[]>
    findById: (id: string) => Promise<ContactDetail | null>
    create: (data: Prisma.ContactUncheckedCreateInput) => Promise<unknown>
    update: (id: string, data: Prisma.ContactUncheckedUpdateInput) => Promise<unknown>
    setPrimary: (id: string) => Promise<ContactDetail | null>
    listMissions: (id: string) => Promise<ContactMissionRow[]>
    softDelete: (id: string) => Promise<unknown>
  }
  pharmacies: { listForPicker: () => Promise<PharmacyRef[]> }
}

const idSchema = z.object({ id: z.string().min(1) })

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
    getById: protectedProcedure.input(idSchema).query(({ input }) => deps.contacts.findById(input.id)),
    pharmacyOptions: protectedProcedure.query(() => deps.pharmacies.listForPicker()),
    create: protectedProcedure
      .input(contactInputSchema)
      .mutation(({ input }) => deps.contacts.create(toData(input))),
    update: protectedProcedure
      .input(updateContactSchema)
      .mutation(({ input }) => deps.contacts.update(input.id, toData(input.data))),
    setPrimary: protectedProcedure
      .input(idSchema)
      .mutation(({ input }) => deps.contacts.setPrimary(input.id)),
    missions: protectedProcedure.input(idSchema).query(({ input }) => deps.contacts.listMissions(input.id)),
    softDelete: protectedProcedure
      .input(idSchema)
      .mutation(({ input }) => deps.contacts.softDelete(input.id)),
  })
}

export const contactRouter = makeContactRouter({
  contacts: contactRepository,
  pharmacies: {
    listForPicker: async () => {
      const rows = await pharmacyRepository.list()
      return rows.map((p) => ({ id: p.id, name: p.name }))
    },
  },
})
