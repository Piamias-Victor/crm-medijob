import { describe, expect, it } from 'vitest'
import { closeInterview } from '@/server/interview/close'
import { memoryCloseDeps } from '@/server/interview/close.test.fixtures'

const payload = { id: 'i1', scores: { B1: 12 }, decision: 'ELIGIBLE' as const }

describe('closeInterview PDF', () => {
  it('stores a compte-rendu after close and returns its document id', async () => {
    const deps = memoryCloseDeps()
    let statusAtStore = ''
    deps.storePdf = async () => {
      statusAtStore = deps.interviews[0]?.status ?? ''
      return { documentId: 'pdf1' }
    }
    const result = await closeInterview(payload, 'u1', deps)
    expect(statusAtStore).toBe('CLOSED')
    expect(result.pdfDocumentId).toBe('pdf1')
  })

  it('still closes when PDF storage fails', async () => {
    const deps = memoryCloseDeps()
    deps.storePdf = async () => {
      throw new Error('blob down')
    }
    const result = await closeInterview(payload, 'u1', deps)
    expect(deps.interviews[0]?.status).toBe('CLOSED')
    expect(result.pdfDocumentId).toBeNull()
  })
})
