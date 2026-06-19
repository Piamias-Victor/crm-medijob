// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { buildCvOpenRouterMessages } from '@/server/ai/openrouter-cv-prompt'

describe('buildCvOpenRouterMessages', () => {
  it('embeds PDF bytes in the OpenRouter file part', () => {
    const messages = buildCvOpenRouterMessages('Extrais le CV', {
      filename: 'cv.pdf',
      mimeType: 'application/pdf',
      dataBase64: 'abc123',
    })
    const content = messages[0]?.content as Array<{ type: string; file?: { file_data: string } }>
    expect(content[1]?.type).toBe('file')
    expect(content[1]?.file?.file_data).toBe('data:application/pdf;base64,abc123')
  })

  it('embeds PNG bytes in the OpenRouter image part', () => {
    const messages = buildCvOpenRouterMessages('Extrais le CV', {
      filename: 'cv.png',
      mimeType: 'image/png',
      dataBase64: 'png-data',
    })
    const content = messages[0]?.content as Array<{ type: string; image_url?: { url: string } }>
    expect(content[1]?.type).toBe('image_url')
    expect(content[1]?.image_url?.url).toBe('data:image/png;base64,png-data')
  })
})
