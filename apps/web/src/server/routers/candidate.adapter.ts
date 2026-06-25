import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { contactRepository } from '@/server/db/repositories/contact.repository'
import { pharmacyRepository } from '@/server/db/repositories/pharmacy.repository'
import { pipelineStageRepository } from '@/server/db/repositories/pipeline-stage.repository'
import { jobTitleRepository } from '@/server/db/repositories/job-title.repository'
import { softwareRepository } from '@/server/db/repositories/software.repository'
import { userRepository } from '@/server/db/repositories/user.repository'
import { loadCandidateReferentials } from '@/server/read-models/candidate-referentials'
import { uploadBlob, deleteBlob, vercelBlobClient } from '@/server/services/blob'
import { createCvExtractionProvider } from '@/server/ai/cv-extraction-provider'
import { runCvExtraction } from '@/server/ai/cv-extraction'
import { createAssistantProvider } from '@/server/ai/provider'
import { createGeoLookup, createGeoQueryLookup } from '@/server/matching/distance'
import { makeCandidateRouter } from '@/server/routers/candidate'

const cvProvider = createCvExtractionProvider()
const documentsProvider = createAssistantProvider()
const lookupPostal = createGeoLookup()
const lookupQuery = createGeoQueryLookup()

export const candidateRouter = makeCandidateRouter({
  listForKanban: (filters) => candidateRepository.listForKanban(filters),
  listForExport: (filters, columnIds) => candidateRepository.listForExport(filters, columnIds ?? []),
  listStages: () => pipelineStageRepository.list(),
  search: (term, limit) => candidateRepository.search(term, limit),
  findProfileById: (id) => candidateRepository.findProfileById(id),
  findDocumentsProfile: (id) => candidateRepository.findDocumentsProfile(id),
  findPharmacyForContext: (id) => pharmacyRepository.findForContext(id),
  findContactById: async (id) => {
    const contact = await contactRepository.findById(id)
    if (!contact) return null
    return { id: contact.id, pharmacyId: contact.pharmacyId, email: contact.email }
  },
  findCandidateGeo: async (id) => {
    const profile = await candidateRepository.findProfileById(id)
    if (!profile) return null
    return {
      postalCode: profile.postalCode,
      address: profile.address,
      city: profile.city,
    }
  },
  listPharmaciesForRadius: (postalCodePrefix) =>
    pharmacyRepository.listForRadiusSearch(postalCodePrefix),
  lookupPostal,
  lookupQuery,
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
  findIdentityByEmail: (email) => candidateRepository.findIdentityByEmail(email),
  findIdentityByNamePhone: (firstName, lastName, phone) =>
    candidateRepository.findIdentityByNamePhone(firstName, lastName, phone),
  mergeCandidates: (keptId, absorbedId, data) =>
    candidateRepository.mergeCandidates(keptId, absorbedId, data),
})
