import type { InterviewMode } from '@prisma/client'
import type {
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

export type MemoryPublished = InterviewTemplateListRow & { sections: SeedSection[] }

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
    findWorkingCopy: async (profileKey, mode) =>
      copies.find((row) => row.profileKey === profileKey && row.mode === mode) ?? null,
    upsertWorkingCopy: async (copy) => {
      const row: MemoryPublished = { ...copy, version: 0, sections: copy.sections }
      const index = copies.findIndex(
        (item) => item.profileKey === copy.profileKey && item.mode === copy.mode,
      )
      if (index >= 0) copies[index] = row
      else copies.push(row)
      return copy
    },
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
