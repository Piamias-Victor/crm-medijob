import type { Prisma } from '@prisma/client'
import type { LogEntityLifecycle } from '@/server/activity-log/log-entity-lifecycle'
import type { SiretResult } from '@/server/services/siret'
import type { PharmacyListEntity } from '@/view-models/pharmacy-list'
import type { PharmacyListFilters } from '@/view-models/pharmacy-list-filters.schema'
import type { PharmacyDetailEntity } from '@/view-models/pharmacy-detail'
import type { PharmacyQuickViewRepoRow } from '@/view-models/pharmacy-quick-view-entity'
import type { PharmacyDuplicateIdentity } from '@/server/pharmacy/detect-duplicate.types'
import type { PharmacyUpdate } from '@/view-models/pharmacy-update'

type Ref = { id: string; name: string }
type CreatedPharmacy = { id: string }

export type PharmacyDeps = {
  pharmacies: {
    list: (filters?: PharmacyListFilters) => Promise<PharmacyListEntity[]>
    findDetailById: (id: string) => Promise<PharmacyDetailEntity | null>
    findQuickViewById: (id: string) => Promise<PharmacyQuickViewRepoRow | null>
    create: (data: Prisma.PharmacyUncheckedCreateInput) => Promise<CreatedPharmacy>
    update: (id: string, data: Prisma.PharmacyUncheckedUpdateInput) => Promise<unknown>
    softDelete: (id: string) => Promise<unknown>
  }
  referentials: {
    listGroupements: () => Promise<Ref[]>
    listSoftwares: () => Promise<Ref[]>
    listRecruiters: () => Promise<Ref[]>
  }
  createGroupement: (name: string) => Promise<Ref>
  createSoftware: (name: string) => Promise<Ref>
  searchSiret: (query: string) => Promise<SiretResult[]>
  findIdentityBySiret: (siret: string) => Promise<PharmacyDuplicateIdentity | null>
  findIdentityByNameCityPostal: (
    name: string,
    city: string,
    postalCode: string,
  ) => Promise<PharmacyDuplicateIdentity | null>
  mergePharmacies: (
    keptId: string,
    absorbedId: string | undefined,
    data: PharmacyUpdate,
  ) => Promise<{ id: string }>
  logLifecycle: LogEntityLifecycle
}
