// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeDocumentRouter } from '@/server/routers/document'
import { documentCaller, makeDocumentDeps } from '@/server/routers/document.test.fixtures'

describe('documentRouter', () => {
  it('lists documents for a pharmacy entity', async () => {
    const deps = makeDocumentDeps()
    const rows = await documentCaller(deps).listByEntity({
      entityType: 'PHARMACY',
      entityId: 'p1',
    })
    expect(deps.listByEntity).toHaveBeenCalledWith('PHARMACY', 'p1')
    expect(rows[0]).toMatchObject({
      category: 'CONTRAT',
      name: 'contrat.pdf',
      sizeLabel: '2 Ko',
    })
  })

  it('uploads to blob then persists a document row', async () => {
    const deps = makeDocumentDeps()
    const fileBase64 = Buffer.from('%PDF-1.4').toString('base64')
    const created = await documentCaller(deps).upload({
      entityType: 'PHARMACY',
      entityId: 'p1',
      category: 'CONTRAT',
      filename: 'contrat.pdf',
      mimeType: 'application/pdf',
      size: 8,
      dataBase64: fileBase64,
    })
    expect(deps.uploadBlob).toHaveBeenCalled()
    expect(deps.create).toHaveBeenCalledWith(
      expect.objectContaining({
        entityType: 'PHARMACY',
        category: 'CONTRAT',
        name: 'contrat.pdf',
        url: 'https://blob.example/contrat.pdf',
        pharmacyId: 'p1',
      }),
    )
    expect(created.name).toBe('contrat.pdf')
  })

  it('rejects unsupported file types', async () => {
    const deps = makeDocumentDeps()
    await expect(
      documentCaller(deps).upload({
        entityType: 'PHARMACY',
        entityId: 'p1',
        category: 'AUTRE',
        filename: 'script.js',
        mimeType: 'application/javascript',
        size: 8,
        dataBase64: Buffer.from('alert(1)').toString('base64'),
      }),
    ).rejects.toThrow()
    expect(deps.uploadBlob).not.toHaveBeenCalled()
  })

  it('rejects unauthenticated callers', async () => {
    const unauth = createCallerFactory(makeDocumentRouter(makeDocumentDeps()))({ session: null })
    await expect(unauth.listByEntity({ entityType: 'PHARMACY', entityId: 'p1' })).rejects.toThrow()
  })
})
