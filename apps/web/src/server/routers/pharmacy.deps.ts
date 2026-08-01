import type { Prisma } from '@prisma/client'
import type { SiretResult } from '@/server/services/siret'
import type { PharmacyListEntity } from '@/view-models/pharmacy-list'
import type { PharmacyListFilters } from '@/view-models/pharmacy-list-filters.schema'
import type { PharmacyDetailEntity } from '@/view-models/pharmacy-detail'
import type { PharmacyQuickViewRepoRow } from '@/view-models/pharmacy-quick-view-entity'

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
  referentials: { listGroupements: () => Promise<Ref[]>; listSoftwares: () => Promise<Ref[]> }
  createGroupement: (name: string) => Promise<Ref>
  createSoftware: (name: string) => Promise<Ref>
  searchSiret: (query: string) => Promise<SiretResult[]>
}
