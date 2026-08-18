import { TRPCError } from '@trpc/server'
import type { InterviewMode } from '@prisma/client'
import { parseAdminSections } from '@/view-models/interview-admin-sections'
import { cloneAdminSections } from '@/view-models/interview-admin-clone'
import { INTERVIEW_TEMPLATE_PAIR_EXISTS } from '@/view-models/interview-template-admin-copy'
import { isAssignableInterviewProfileKey } from '@/view-models/interview-template-profile-key'
import type {
  InterviewTemplateWorkingCopy,
  TemplateAdminStore,
} from '@/server/interview/template-admin-types'

export type CreateInterviewTemplateInput = {
  jobTitleId: string
  mode: InterviewMode
  profileKey?: string
  source?: { profileKey: string; mode: InterviewMode }
}

export type JobTitleKeyStore = {
  findById: (id: string) => Promise<{ id: string; name: string; profileKey: string | null } | null>
  findByProfileKey: (key: string) => Promise<{ id: string } | null>
  setProfileKey: (id: string, profileKey: string) => Promise<void>
}

export async function createInterviewTemplate(
  input: CreateInterviewTemplateInput,
  store: TemplateAdminStore,
  jobs: JobTitleKeyStore,
): Promise<InterviewTemplateWorkingCopy> {
  const job = await jobs.findById(input.jobTitleId)
  if (!job) throw new TRPCError({ code: 'NOT_FOUND' })
  const profileKey = job.profileKey ?? input.profileKey
  if (!profileKey || !isAssignableInterviewProfileKey(profileKey)) {
    throw new TRPCError({ code: 'BAD_REQUEST' })
  }
  if (!job.profileKey) {
    const taken = await jobs.findByProfileKey(profileKey)
    if (taken) throw new TRPCError({ code: 'CONFLICT' })
  }
  await assertPairFree(store, profileKey, input.mode)
  if (!job.profileKey) await jobs.setProfileKey(job.id, profileKey)
  const copy: InterviewTemplateWorkingCopy = {
    profileKey,
    mode: input.mode,
    label: job.name,
    sections: await copyPublishedSections(input, store),
  }
  await store.upsertWorkingCopy(copy)
  await store.setWorkingCopyArchived(profileKey, input.mode, null)
  return copy
}

async function copyPublishedSections(
  input: CreateInterviewTemplateInput,
  store: TemplateAdminStore,
) {
  if (!input.source) return []
  const published = await store.findPublished(input.source.profileKey, input.source.mode)
  if (!published) throw new TRPCError({ code: 'NOT_FOUND' })
  return cloneAdminSections(parseAdminSections(published.sections))
}

async function assertPairFree(
  store: TemplateAdminStore,
  profileKey: string,
  mode: CreateInterviewTemplateInput['mode'],
) {
  const working = await store.findWorkingCopy(profileKey, mode)
  if (working?.archivedAt) return
  const existing = working ?? (await store.findPublished(profileKey, mode))
  if (existing) {
    throw new TRPCError({ code: 'CONFLICT', message: INTERVIEW_TEMPLATE_PAIR_EXISTS })
  }
}
