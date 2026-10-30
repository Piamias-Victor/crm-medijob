import { TRPCError } from '@trpc/server'
import { adminProcedure, protectedProcedure, router } from '@/server/trpc'
import { pharmacyScrapeRepository } from '@/server/db/repositories/pharmacy-scrape.repository'
import { parseEdithPharmacyScrapeWorkbook } from '@/lib/pharmacy-scrape/parse-edith-workbook'
import { buildPharmacyScrapePreview } from '@/server/pharmacy-scrape/preview-import'
import { toPharmacyScrapeListRows } from '@/view-models/pharmacy-scrape-list-row'
import { pharmacyScrapeListFiltersSchema } from '@/view-models/pharmacy-scrape-list-filters.schema'
import {
  pharmacyScrapeSoftDeleteSchema,
  pharmacyScrapeUploadSchema,
} from '@/server/routers/pharmacy-scrape.schema'

async function parseUpload(dataBase64: string) {
  try {
    return await parseEdithPharmacyScrapeWorkbook(Buffer.from(dataBase64, 'base64'))
  } catch (e) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: e instanceof Error ? e.message : 'Import invalide',
    })
  }
}

export const pharmacyScrapeRouter = router({
  list: protectedProcedure
    .input(pharmacyScrapeListFiltersSchema.optional())
    .query(async ({ input }) => {
      const filters = input ?? {}
      const [rows, duplicateEmails] = await Promise.all([
        pharmacyScrapeRepository.list(filters),
        pharmacyScrapeRepository.listDuplicateEmails(),
      ])
      return toPharmacyScrapeListRows(rows, new Set(duplicateEmails))
    }),

  provenances: protectedProcedure.query(async () => {
    const rows = await pharmacyScrapeRepository.listProvenances()
    return rows.map((r) => r.provenance)
  }),

  departments: protectedProcedure.query(async () => {
    const rows = await pharmacyScrapeRepository.listDepartments()
    return rows.map((r) => r.department).filter((d): d is string => Boolean(d))
  }),

  previewImport: adminProcedure.input(pharmacyScrapeUploadSchema).mutation(async ({ input }) => {
    const parsed = await parseUpload(input.dataBase64)
    return buildPharmacyScrapePreview(parsed)
  }),

  commitImport: adminProcedure.input(pharmacyScrapeUploadSchema).mutation(async ({ input }) => {
    const parsed = await parseUpload(input.dataBase64)
    return pharmacyScrapeRepository.upsertBatch(parsed.rows)
  }),

  softDelete: adminProcedure
    .input(pharmacyScrapeSoftDeleteSchema)
    .mutation(async ({ input }) => pharmacyScrapeRepository.softDelete(input.ids)),
})
