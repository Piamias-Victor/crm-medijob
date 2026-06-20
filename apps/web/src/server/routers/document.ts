import type { DocumentEntityType, Prisma } from '@prisma/client'
import { router, protectedProcedure } from '@/server/trpc'
import { documentRepository } from '@/server/db/repositories/document.repository'
import { deleteBlob, uploadBlob, vercelBlobClient, type BlobClient } from '@/server/services/blob'
import { toDocumentListRow, type DocumentRecord } from '@/view-models/document-list'
import {
  deleteDocumentSchema,
  listDocumentsSchema,
  uploadDocumentSchema,
  type UploadDocumentInput,
} from '@/server/routers/document.schema'

export type DocumentDeps = {
  listByEntity: (entityType: DocumentEntityType, entityId: string) => Promise<DocumentRecord[]>
  findById: (id: string) => Promise<DocumentRecord | null>
  create: (data: Prisma.DocumentUncheckedCreateInput) => Promise<DocumentRecord>
  deleteById: (id: string) => Promise<DocumentRecord | null>
  uploadBlob: (input: { pathname: string; body: Buffer; contentType: string }) => Promise<{ url: string }>
  deleteBlob: (url: string) => Promise<void>
}

function entityLink(input: Pick<UploadDocumentInput, 'entityType' | 'entityId'>) {
  return {
    pharmacyId: input.entityType === 'PHARMACY' ? input.entityId : null,
    contactId: input.entityType === 'CONTACT' ? input.entityId : null,
    missionId: input.entityType === 'MISSION' ? input.entityId : null,
    candidateId: input.entityType === 'CANDIDATE' ? input.entityId : null,
  }
}

export function makeDocumentRouter(deps: DocumentDeps) {
  return router({
    listByEntity: protectedProcedure.input(listDocumentsSchema).query(async ({ input }) =>
      (await deps.listByEntity(input.entityType, input.entityId)).map(toDocumentListRow),
    ),
    upload: protectedProcedure.input(uploadDocumentSchema).mutation(async ({ input }) => {
      const body = Buffer.from(input.dataBase64, 'base64')
      const pathname = `${input.entityType.toLowerCase()}/${input.entityId}/${Date.now()}-${input.filename}`
      const blob = await deps.uploadBlob({ pathname, body, contentType: input.mimeType })
      try {
        const doc = await deps.create({
          entityType: input.entityType,
          category: input.category,
          name: input.filename,
          url: blob.url,
          size: input.size,
          mimeType: input.mimeType,
          ...entityLink(input),
        })
        return toDocumentListRow(doc)
      } catch (error) {
        await deps.deleteBlob(blob.url).catch(() => undefined)
        throw error
      }
    }),
    delete: protectedProcedure.input(deleteDocumentSchema).mutation(async ({ input }) => {
      const doc = await deps.findById(input.id)
      if (!doc) return { id: input.id }
      await deps.deleteBlob(doc.url)
      await deps.deleteById(input.id)
      return { id: doc.id }
    }),
  })
}

function makeBlobDeps(client: BlobClient): Pick<DocumentDeps, 'uploadBlob' | 'deleteBlob'> {
  return {
    uploadBlob: (input) => uploadBlob(client, input),
    deleteBlob: (url) => deleteBlob(client, url),
  }
}

export const documentRouter = makeDocumentRouter({
  listByEntity: (entityType, entityId) => documentRepository.listByEntity(entityType, entityId),
  findById: (id) => documentRepository.findById(id),
  create: (data) => documentRepository.create(data),
  deleteById: (id) => documentRepository.deleteById(id),
  ...makeBlobDeps(vercelBlobClient),
})
