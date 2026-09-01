import { TRPCError } from '@trpc/server'
import type { PharmacyUpdate } from '@/view-models/pharmacy-update'
import type { ContactMatchIdentity } from '@/server/badakan-enterprise/pick-contact-match'
import type { EnterpriseVerifyRow } from '@/server/badakan-enterprise/verify.types'
import type { ExistingPharmacyIdentity } from '@/server/badakan-enterprise/verify.types'
import type { VerifyContactCreate } from '@/server/badakan-enterprise/confirm-verify'
import { badakanEnterpriseRepository } from '@/server/db/repositories/badakan-enterprise.repository'
import { makePharmacyDuplicateRepository } from '@/server/db/repositories/pharmacy-duplicate.repo'
import { pharmacyRepository } from '@/server/db/repositories/pharmacy.repository'
import { contactRepository } from '@/server/db/repositories/contact.repository'
import { contactRoleRepository } from '@/server/db/repositories/contact-role.repository'
import { listContactIdentitiesByPharmacy } from '@/server/db/repositories/contact-identity.repo'
import { prisma } from '@/server/db/repositories/client'

const duplicates = makePharmacyDuplicateRepository(prisma)

export type BadakanEnterpriseDeps = {
  listPending: () => Promise<EnterpriseVerifyRow[]>
  findById: (id: string) => Promise<EnterpriseVerifyRow | null>
  findIdentityBySiret: (siret: string) => Promise<ExistingPharmacyIdentity | null>
  listContacts: (pharmacyId: string) => Promise<ContactMatchIdentity[]>
  createPharmacy: (data: PharmacyUpdate) => Promise<{ id: string }>
  createContact: (data: VerifyContactCreate) => Promise<{ id: string }>
  setPrimary: (id: string) => Promise<unknown>
  findTitulaireRoleId: () => Promise<string>
  markVerified: (id: string, pharmacyId: string) => Promise<unknown>
}

export const defaultBadakanEnterpriseDeps: BadakanEnterpriseDeps = {
  listPending: () => badakanEnterpriseRepository.listPending(),
  findById: (id) => badakanEnterpriseRepository.findById(id),
  findIdentityBySiret: async (siret) => {
    const hit = await duplicates.findIdentityBySiret(siret)
    return hit ? { id: hit.id, name: hit.name, siret: hit.siret } : null
  },
  listContacts: (pharmacyId) => listContactIdentitiesByPharmacy(prisma, pharmacyId),
  createPharmacy: (data) => pharmacyRepository.create(data),
  createContact: (data) => contactRepository.create(data),
  setPrimary: (id) => contactRepository.setPrimary(id),
  findTitulaireRoleId: async () => {
    const role = await contactRoleRepository.findByName('Titulaire')
    if (!role) throw new TRPCError({ code: 'PRECONDITION_FAILED', message: 'Rôle Titulaire manquant' })
    return role.id
  },
  markVerified: (id, pharmacyId) => badakanEnterpriseRepository.markVerified(id, pharmacyId),
}
