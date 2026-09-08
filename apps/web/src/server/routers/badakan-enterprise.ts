import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, protectedProcedure, permissionProcedure } from '@/server/trpc'
import { toBadakanEnterpriseListItems } from '@/view-models/badakan-enterprise-list'
import { toBadakanEnterprisePreview } from '@/view-models/badakan-enterprise-preview'
import { previewEnterpriseVerify } from '@/server/badakan-enterprise/preview-verify'
import { confirmEnterpriseVerify } from '@/server/badakan-enterprise/confirm-verify'
import {
  defaultBadakanEnterpriseDeps,
  type BadakanEnterpriseDeps,
} from './badakan-enterprise.deps'

const idInput = z.object({ id: z.string().min(1) })
const confirmInput = z.object({
  id: z.string().min(1),
  siret: z.string().trim().optional(),
})

export function makeBadakanEnterpriseRouter(deps: BadakanEnterpriseDeps) {
  return router({
    listPending: protectedProcedure.query(async () => {
      const rows = await deps.listPending()
      const existingBySiret = new Map<string, { id: string; name: string }>()
      for (const row of rows) {
        const siret = row.siret?.trim()
        if (!siret || existingBySiret.has(siret)) continue
        const hit = await deps.findIdentityBySiret(siret)
        if (hit) existingBySiret.set(siret, { id: hit.id, name: hit.name })
      }
      return toBadakanEnterpriseListItems(rows, existingBySiret)
    }),
    getPreview: protectedProcedure.input(idInput).query(async ({ input }) => {
      const row = await deps.findById(input.id)
      if (!row) return null
      const preview = await previewEnterpriseVerify(row, deps)
      return toBadakanEnterprisePreview(row, preview)
    }),
    confirm: permissionProcedure('crm.write')
      .input(confirmInput)
      .mutation(async ({ input }) => {
        const row = await deps.findById(input.id)
        if (!row) throw new TRPCError({ code: 'NOT_FOUND' })
        const siret = input.siret?.trim() || row.siret
        if (!siret?.trim()) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'SIRET manquant' })
        }
        return confirmEnterpriseVerify({ ...row, siret }, deps)
      }),
  })
}

export const badakanEnterpriseRouter = makeBadakanEnterpriseRouter(
  defaultBadakanEnterpriseDeps,
)
