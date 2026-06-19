import { buildCvExtractionPrompt } from '@/server/ai/cv-extraction-prompt'
import type { CvExtractionFileInput } from '@/server/ai/cv-extraction-provider'

export type OpenRouterMessage = {
  role: 'user'
  content: Array<
    | { type: 'text'; text: string }
    | { type: 'image_url'; image_url: { url: string } }
    | { type: 'file'; file: { filename: string; file_data: string } }
  >
}

export function buildCvOpenRouterMessages(
  prompt: string,
  file: CvExtractionFileInput,
): OpenRouterMessage[] {
  const dataUrl = `data:${file.mimeType};base64,${file.dataBase64}`
  const filePart =
    file.mimeType.startsWith('image/')
      ? { type: 'image_url' as const, image_url: { url: dataUrl } }
      : {
          type: 'file' as const,
          file: { filename: file.filename, file_data: dataUrl },
        }

  return [{ role: 'user', content: [{ type: 'text', text: prompt }, filePart] }]
}

export function buildCvExtractionPromptForFile(filename: string) {
  return buildCvExtractionPrompt(filename)
}
