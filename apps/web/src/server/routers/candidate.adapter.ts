import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { pipelineStageRepository } from '@/server/db/repositories/pipeline-stage.repository'
import { jobTitleRepository } from '@/server/db/repositories/job-title.repository'
import { softwareRepository } from '@/server/db/repositories/software.repository'
import { userRepository } from '@/server/db/repositories/user.repository'
import { loadCandidateReferentials } from '@/server/read-models/candidate-referentials'
import { uploadBlob, deleteBlob, vercelBlobClient } from '@/server/services/blob'
import { createCvExtractionProvider } from '@/server/ai/cv-extraction-provider'
import { runCvExtraction } from '@/server/ai/cv-extraction'
import { createAssistantProvider } from '@/server/ai/provider'
import { makeCandidateRouter } from '@/server/routers/candidate'

const cvProvider = createCvExtractionProvider()
const documentsProvider = createAssistantProvider()

export const candidateRouter = makeCandidateRouter({
  listForKanban: (filters) => candidateRepository.listForKanban(filters),
  listStages: () => pipelineStageRepository.list(),
  search: (term, limit) => candidateRepository.search(term, limit),
  findProfileById: (id) => candidateRepository.findProfileById(id),
  findDocumentsProfile: (id) => candidateRepository.findDocumentsProfile(id),
  updateDerivedFields: (id, fields) => candidateRepository.updateDerivedFields(id, fields),
  provider: documentsProvider,
  updateProfile: (id, data) => candidateRepository.updateProfile(id, data),
  createProfile: (input) => candidateRepository.createProfile(input),
  referentials: () =>
    loadCandidateReferentials({
      listJobTitles: () => jobTitleRepository.list(),
      listSoftwares: () => softwareRepository.list(),
      listRecruiters: () => userRepository.listRecruiters(),
      listPipelineStages: () => pipelineStageRepository.list(),
    }),
  uploadCvBlob: (input) => uploadBlob(vercelBlobClient, input),
  deleteCvBlob: (url) => deleteBlob(vercelBlobClient, url),
  runCvExtraction: (file) => runCvExtraction(cvProvider, file),
  listJobTitles: () => jobTitleRepository.list(),
  confirmCvExtraction: (id, data) => candidateRepository.updateProfile(id, data),
})
