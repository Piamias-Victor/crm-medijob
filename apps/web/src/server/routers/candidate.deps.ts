import type { candidateRepository } from '@/server/db/repositories/candidate.repository'
import type { RawCandidate, RawStage } from '@/view-models/candidate-kanban.types'
import { loadCandidateReferentials } from '@/server/read-models/candidate-referentials'
import type { CandidateCvDeps } from '@/server/routers/candidate-cv'
import type { CandidateDocumentsDeps } from '@/server/routers/candidate-documents'
import type { CandidateSearchRow } from '@/server/routers/candidate-search'
import type { CandidateListFilters } from '@/view-models/candidate-list-filters.schema'
import type { RawCandidateExport } from '@/view-models/candidate-export.types'
import type { CvthequeExportColumnId } from '@/view-models/cvtheque-export-column-ids'

export type CandidateDeps = CandidateCvDeps &
  CandidateDocumentsDeps & {
    listForKanban: (filters?: CandidateListFilters) => Promise<RawCandidate[]>
    listForExport: (
      filters?: CandidateListFilters,
      columnIds?: CvthequeExportColumnId[],
    ) => Promise<RawCandidateExport[]>
    listStages: () => Promise<RawStage[]>
    search: (term: string, limit?: number) => Promise<CandidateSearchRow[]>
    updateProfile: (
      id: string,
      data: Parameters<typeof candidateRepository.updateProfile>[1],
    ) => ReturnType<typeof candidateRepository.updateProfile>
    createProfile: (
      input: Parameters<typeof candidateRepository.createProfile>[0],
    ) => ReturnType<typeof candidateRepository.createProfile>
    referentials: () => ReturnType<typeof loadCandidateReferentials>
    findIdentityByEmail: typeof candidateRepository.findIdentityByEmail
    findIdentityByNamePhone: typeof candidateRepository.findIdentityByNamePhone
    mergeCandidates: typeof candidateRepository.mergeCandidates
  }
