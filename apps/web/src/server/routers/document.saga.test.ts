// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { makeDocumentRouter } from '@/server/routers/document'
import { documentCaller, documentRecord, makeDocumentDeps } from '@/server/routers/document.test.fixtures'

describe('documentRouter saga', () => {
  it('deletes blob before document row', async () => {
    const order: string[] = []
    const deps = makeDocumentDeps({
      deleteBlob: vi.fn().mockImplementation(async () => {
        order.push('blob')
      }),
      deleteById: vi.fn().mockImplementation(async () => {
        order.push('db')
        return documentRecord
      }),
    })
    await documentCaller(deps).delete({ id: 'd1' })
    expect(deps.deleteBlob).toHaveBeenCalledWith('https://blob.example/contrat.pdf')
    expect(deps.deleteById).toHaveBeenCalledWith('d1')
    expect(order).toEqual(['blob', 'db'])
  })

  it('rolls back blob when document create fails after upload', async () => {
    const deps = makeDocumentDeps({
      create: vi.fn().mockRejectedValue(new Error('db down')),
    })
    const fileBase64 = Buffer.from('%PDF-1.4').toString('base64')
    await expect(
      documentCaller(deps).upload({
        entityType: 'PHARMACY',
        entityId: 'p1',
        category: 'CONTRAT',
        filename: 'contrat.pdf',
        mimeType: 'application/pdf',
        size: 8,
        dataBase64: fileBase64,
      }),
    ).rejects.toThrow('db down')
    expect(deps.uploadBlob).toHaveBeenCalled()
    expect(deps.deleteBlob).toHaveBeenCalledWith('https://blob.example/contrat.pdf')
  })

  it('keeps document row when blob deletion fails', async () => {
    const deps = makeDocumentDeps({
      deleteBlob: vi.fn().mockRejectedValue(new Error('blob down')),
      deleteById: vi.fn(),
    })
    await expect(documentCaller(deps).delete({ id: 'd1' })).rejects.toThrow('blob down')
    expect(deps.deleteById).not.toHaveBeenCalled()
  })
})
