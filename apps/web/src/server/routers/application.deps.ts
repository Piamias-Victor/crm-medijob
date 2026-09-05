import { applicationRepository } from '@/server/db/repositories/application.repository'
import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { jobOfferRepository } from '@/server/db/repositories/job-offer.repository'
import { detectApplicationDuplicate } from '@/server/application/intake.adapter'
import { refuseApplication } from '@/server/application/intake'
import { copyRemoteCvToBlob } from '@/server/application/copy-cv'
import { resolveBlobClient } from '@/server/services/resolve-blob-client'
import type { InboxItem } from '@/view-models/application-inbox'

export type ApplicationDeps = {
  listInbox: () => Promise<InboxItem[]>
  getById: typeof applicationRepository.findDetailById
  detectDuplicate: (applicationId: string) => ReturnType<typeof detectApplicationDuplicate>
  refuse: (id: string) => ReturnType<typeof refuseApplication>
  createProfile: typeof candidateRepository.createProfile
  markAccepted: typeof applicationRepository.markAccepted
  findById: typeof applicationRepository.findById
  copyCvUrl: (sourceUrl: string, applicationId: string) => Promise<string | null>
  listOwnedListingIds: typeof jobOfferRepository.listBoardListingIds
  findByBoardSubmissionIds: typeof applicationRepository.findByBoardSubmissionIds
  createFromIngest: typeof applicationRepository.createFromIngest
}

export const defaultApplicationDeps: ApplicationDeps = {
  listInbox: () => applicationRepository.listInbox(),
  getById: (id) => applicationRepository.findDetailById(id),
  detectDuplicate: detectApplicationDuplicate,
  refuse: (id) =>
    refuseApplication(id, {
      findApplication: applicationRepository.findById,
      markRefused: async (appId) => {
        const updated = await applicationRepository.updateStatus(appId, 'REFUSEE')
        return { id: updated.id, status: updated.status }
      },
    }),
  createProfile: (input) => candidateRepository.createProfile(input),
  markAccepted: (id, candidateId) => applicationRepository.markAccepted(id, candidateId),
  findById: (id) => applicationRepository.findById(id),
  copyCvUrl: (sourceUrl, applicationId) =>
    copyRemoteCvToBlob(sourceUrl, applicationId, resolveBlobClient()),
  listOwnedListingIds: () => jobOfferRepository.listBoardListingIds(),
  findByBoardSubmissionIds: (ids) => applicationRepository.findByBoardSubmissionIds(ids),
  createFromIngest: (data) => applicationRepository.createFromIngest(data),
}
