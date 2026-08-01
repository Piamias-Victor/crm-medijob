import { z } from 'zod'
import { protectedProcedure } from '@/server/trpc'
import { pharmacyInputSchema } from '@/view-models/pharmacy-form.schema'
import {
  detectPharmacyDuplicateInputSchema,
  pharmacyMergeInputSchema,
} from '@/view-models/pharmacy-duplicate.schema'
import type { PharmacyDeps } from '@/server/routers/pharmacy.deps'
import {
  handleCommitPharmacyImport,
  handleDetectPharmacyDuplicate,
  handleMergePharmacy,
} from '@/server/routers/pharmacy-duplicate-handlers'

const pharmacyImportRowsSchema = z.array(pharmacyInputSchema).max(2000)

export function pharmacyDuplicateRoutes(deps: PharmacyDeps) {
  return {
    detectDuplicate: protectedProcedure
      .input(detectPharmacyDuplicateInputSchema)
      .query(({ input }) => handleDetectPharmacyDuplicate(deps, input)),
    merge: protectedProcedure
      .input(pharmacyMergeInputSchema)
      .mutation(async ({ ctx, input }) => {
        const row = await handleMergePharmacy(deps, input)
        await deps.logLifecycle({
          action: 'updated',
          entityType: 'PHARMACY',
          entityId: row.id,
          user: ctx.session.user,
        })
        return row
      }),
    commitImport: protectedProcedure
      .input(pharmacyImportRowsSchema)
      .mutation(async ({ ctx, input }) => {
        const result = await handleCommitPharmacyImport(deps, input)
        for (const entityId of result.createdIds) {
          await deps.logLifecycle({
            action: 'created',
            entityType: 'PHARMACY',
            entityId,
            user: ctx.session.user,
          })
        }
        return result
      }),
  }
}
