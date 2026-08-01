import { pharmacyRepository } from '@/server/db/repositories/pharmacy.repository'
import { groupementRepository } from '@/server/db/repositories/groupement.repository'
import { softwareRepository } from '@/server/db/repositories/software.repository'
import { findPharmacyQuickViewById } from '@/server/db/repositories/pharmacy-quick-view.repo'
import { defaultLogLifecycle } from '@/server/activity-log/default-lifecycle'
import { searchSiret as searchSiretService } from '@/server/services/siret'
import { makePharmacyRouter } from '@/server/routers/pharmacy'

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
  logLifecycle: defaultLogLifecycle,
})
