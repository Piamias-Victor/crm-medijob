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

export function makeBadakanEnterpriseRouter(deps: BadakanEnterpriseDeps) {
  return router({
    listPending: protectedProcedure.query(async () =>
      toBadakanEnterpriseListItems(await deps.listPending()),
    ),
    getPreview: protectedProcedure.input(idInput).query(async ({ input }) => {
      const row = await deps.findById(input.id)
      if (!row) return null
      const preview = await previewEnterpriseVerify(row, deps)
      return toBadakanEnterprisePreview(row, preview)
    }),
    confirm: permissionProcedure('crm.write')
      .input(idInput)
      .mutation(async ({ input }) => {
        const row = await deps.findById(input.id)
        if (!row) throw new TRPCError({ code: 'NOT_FOUND' })
        return confirmEnterpriseVerify(row, deps)
      }),
  })
}

export const badakanEnterpriseRouter = makeBadakanEnterpriseRouter(
  defaultBadakanEnterpriseDeps,
)
