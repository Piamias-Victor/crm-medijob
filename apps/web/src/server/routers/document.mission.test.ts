// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { documentCaller, makeDocumentDeps } from '@/server/routers/document.test.fixtures'

describe('documentRouter MISSION scope', () => {
  it('lists documents for a mission entity', async () => {
    const deps = makeDocumentDeps()
    const rows = await documentCaller(deps).listByEntity({
      entityType: 'MISSION',
      entityId: 'm1',
    })
    expect(deps.listByEntity).toHaveBeenCalledWith('MISSION', 'm1')
    expect(rows[0]).toMatchObject({ name: 'contrat.pdf' })
  })

  it('uploads mission document with missionId link', async () => {
    const deps = makeDocumentDeps()
    const fileBase64 = Buffer.from('%PDF-1.4').toString('base64')
    await documentCaller(deps).upload({
      entityType: 'MISSION',
      entityId: 'm1',
      category: 'CONVENTION',
      filename: 'convention.pdf',
      mimeType: 'application/pdf',
      size: 8,
      dataBase64: fileBase64,
    })
    expect(deps.create).toHaveBeenCalledWith(
      expect.objectContaining({
        entityType: 'MISSION',
        missionId: 'm1',
        category: 'CONVENTION',
        name: 'convention.pdf',
      }),
    )
  })

  it('deletes mission document via blob and row', async () => {
    const deps = makeDocumentDeps()
    await documentCaller(deps).delete({ id: 'd1' })
    expect(deps.deleteBlob).toHaveBeenCalledWith('https://blob.example/contrat.pdf')
    expect(deps.deleteById).toHaveBeenCalledWith('d1')
  })
})
