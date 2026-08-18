import type { InterviewMode } from '@prisma/client'
import type {
  InterviewTemplateCopyRow,
  InterviewTemplateListRow,
  TemplateAdminStore,
} from '@/server/interview/template-admin-types'

type SeedQuestion = {
  id?: string
  question?: string
  mapping?: string
  suggestedAnswers?: unknown
}
type SeedSection = { id?: string; title?: string; questions: SeedQuestion[] }

export type MemoryPublished = InterviewTemplateListRow & {
  sections: SeedSection[]
  archivedAt?: Date | null
}

export function memoryTemplateAdminDeps(seed: MemoryPublished[] = []): TemplateAdminStore & {
  published: MemoryPublished[]
  copies: MemoryPublished[]
} {
  const published = seed.map((row) => ({ ...row }))
  const copies: MemoryPublished[] = []
  return {
    published,
    copies,
    listPublished: async () =>
      published.map(({ profileKey, mode, version, label }) => ({
        profileKey,
        mode,
        version,
        label,
      })),
    findPublished: async (profileKey, mode) => latest(published, profileKey, mode),
    findWorkingCopy: async (profileKey, mode) => {
      const row = copies.find((item) => item.profileKey === profileKey && item.mode === mode)
      return row ? toCopyRow(row) : null
    },
    upsertWorkingCopy: async (copy) => {
      const index = copies.findIndex(
        (item) => item.profileKey === copy.profileKey && item.mode === copy.mode,
      )
      const archivedAt = copies[index]?.archivedAt ?? null
      const row: MemoryPublished = { ...copy, version: 0, sections: copy.sections, archivedAt }
      if (index >= 0) copies[index] = row
      else copies.push(row)
      return toCopyRow(row)
    },
    setWorkingCopyArchived: async (profileKey, mode, archivedAt) => {
      const row = copies.find((item) => item.profileKey === profileKey && item.mode === mode)
      if (row) row.archivedAt = archivedAt
    },
    listWorkingCopies: async () =>
      copies.map((row) => ({
        profileKey: row.profileKey,
        mode: row.mode,
        archivedAt: row.archivedAt ?? null,
      })),
    createPublishedVersion: async (row) => {
      published.push({ ...row, sections: row.sections as SeedSection[] })
      return row
    },
  }
}

function latest(rows: MemoryPublished[], profileKey: string, mode: InterviewMode) {
  return (
    rows
      .filter((row) => row.profileKey === profileKey && row.mode === mode)
      .sort((left, right) => right.version - left.version)[0] ?? null
  )
}

function toCopyRow(row: MemoryPublished): InterviewTemplateCopyRow {
  return {
    profileKey: row.profileKey,
    mode: row.mode,
    label: row.label,
    sections: row.sections,
    archivedAt: row.archivedAt ?? null,
  }
}
