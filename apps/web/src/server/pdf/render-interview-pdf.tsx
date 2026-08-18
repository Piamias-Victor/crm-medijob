import { renderToBuffer } from '@react-pdf/renderer'
import { InterviewPdfDocument } from './interview-pdf-document'
import type { InterviewPdfModel } from '@/view-models/interview-pdf-model'

export async function renderInterviewPdf(model: InterviewPdfModel): Promise<Buffer> {
  return renderToBuffer(<InterviewPdfDocument model={model} />)
}
