import { pharmacyRepository } from '@/server/db/repositories/pharmacy.repository'
import { groupementRepository } from '@/server/db/repositories/groupement.repository'
import { softwareRepository } from '@/server/db/repositories/software.repository'
import { userRepository } from '@/server/db/repositories/user.repository'
import { findPharmacyQuickViewById } from '@/server/db/repositories/pharmacy-quick-view.repo'
import { makePharmacyDuplicateRepository } from '@/server/db/repositories/pharmacy-duplicate.repo'
import { makePharmacyMergeRepository } from '@/server/db/repositories/pharmacy-merge.repo'
import { prisma } from '@/server/db/repositories/client'
import { defaultLogLifecycle } from '@/server/activity-log/default-lifecycle'
import { searchSiret as searchSiretService } from '@/server/services/siret'
import { createGeoQueryLookup } from '@/server/matching/distance'
import { makePharmacyRouter } from '@/server/routers/pharmacy'
import { listPharmacyMapPins } from '@/server/db/repositories/map-pins.repo'

const pharmacyDuplicates = makePharmacyDuplicateRepository(prisma)
const pharmacyMerge = makePharmacyMergeRepository(prisma)
const lookupGeo = createGeoQueryLookup()

export const pharmacyRouter = makePharmacyRouter({
  lookupGeo,
  pharmacies: {
    list: (filters) => pharmacyRepository.list(filters),
    listMapPins: () => listPharmacyMapPins(prisma),
    findDetailById: (id) => pharmacyRepository.findDetailById(id),
    findQuickViewById: (id) => findPharmacyQuickViewById(id),
    findAddressById: async (id) => {
      const row = await pharmacyRepository.findById(id)
      if (!row) return null
      return { address: row.address, city: row.city, postalCode: row.postalCode }
    },
    create: (data) => pharmacyRepository.create(data),
    update: (id, data) => pharmacyRepository.update(id, data),
    softDelete: (id) => pharmacyRepository.softDelete(id),
  },
  referentials: {
    listGroupements: () => groupementRepository.list(),
    listSoftwares: () => softwareRepository.list(),
    listRecruiters: () => userRepository.listRecruiters(),
  },
  createGroupement: (name) => groupementRepository.create({ name }),
  createSoftware: (name) => softwareRepository.create({ name }),
  searchSiret: (query) => searchSiretService(query),
  findIdentityBySiret: (siret) => pharmacyDuplicates.findIdentityBySiret(siret),
  findIdentityByNameCityPostal: (name, city, postalCode) =>
    pharmacyDuplicates.findIdentityByNameCityPostal(name, city, postalCode),
  mergePharmacies: (keptId, absorbedId, data) => pharmacyMerge.merge(keptId, absorbedId, data),
  logLifecycle: defaultLogLifecycle,
})
