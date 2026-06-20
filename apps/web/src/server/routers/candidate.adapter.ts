import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { pipelineStageRepository } from '@/server/db/repositories/pipeline-stage.repository'
import { jobTitleRepository } from '@/server/db/repositories/job-title.repository'
import { fetchCandidateReferentials } from '@/server/read-models/candidate-referentials.adapter'
import { uploadBlob, deleteBlob, vercelBlobClient } from '@/server/services/blob'
import { createCvExtractionProvider } from '@/server/ai/cv-extraction-provider'
import { runCvExtraction } from '@/server/ai/cv-extraction'
import { createAssistantProvider } from '@/server/ai/provider'
import { makeCandidateRouter } from '@/server/routers/candidate'

const cvProvider = createCvExtractionProvider()
const documentsProvider = createAssistantProvider()

export const candidateRouter = makeCandidateRouter({
  listForKanban: () => candidateRepository.listForKanban(),
  listStages: () => pipelineStageRepository.list(),
  search: (term, limit) => candidateRepository.search(term, limit),
  findProfileById: (id) => candidateRepository.findProfileById(id),
  findDocumentsProfile: (id) => candidateRepository.findDocumentsProfile(id),
  updateDerivedFields: (id, fields) => candidateRepository.updateDerivedFields(id, fields),
  provider: documentsProvider,
  updateProfile: (id, data) => candidateRepository.updateProfile(id, data),
  referentials: fetchCandidateReferentials,
  uploadCvBlob: (input) => uploadBlob(vercelBlobClient, input),
  deleteCvBlob: (url) => deleteBlob(vercelBlobClient, url),
  runCvExtraction: (file) => runCvExtraction(cvProvider, file),
  listJobTitles: () => jobTitleRepository.list(),
  confirmCvExtraction: (id, data) => candidateRepository.updateProfile(id, data),
})
