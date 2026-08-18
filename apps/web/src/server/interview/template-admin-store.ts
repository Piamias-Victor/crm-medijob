import type { Prisma } from '@prisma/client'
import { interviewTemplateRepository } from '@/server/db/repositories/interview-template.repository'
import { interviewTemplateWorkingCopyRepository } from '@/server/db/repositories/interview-template-working-copy.repository'
import type { TemplateAdminStore } from '@/server/interview/template-admin-types'

export const liveTemplateAdminStore: TemplateAdminStore = {
  listPublished: () => interviewTemplateRepository.listLatestPairs(),
  findPublished: (profileKey, mode) =>
    interviewTemplateRepository.findLatestRow(profileKey, mode),
  findWorkingCopy: async (profileKey, mode) =>
    interviewTemplateWorkingCopyRepository.find(profileKey, mode),
  upsertWorkingCopy: async (copy) =>
    interviewTemplateWorkingCopyRepository.upsert({
      ...copy,
      sections: copy.sections as Prisma.InputJsonValue,
    }),
  setWorkingCopyArchived: async (profileKey, mode, archivedAt) => {
    await interviewTemplateWorkingCopyRepository.setArchived(profileKey, mode, archivedAt)
  },
  listWorkingCopies: () => interviewTemplateWorkingCopyRepository.list(),
  createPublishedVersion: (row) =>
    interviewTemplateRepository.createVersion({
      ...row,
      sections: row.sections as Prisma.InputJsonValue,
    }),
}
