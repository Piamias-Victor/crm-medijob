import { renderToBuffer } from '@react-pdf/renderer'
import { DevisPdfDocument } from './devis-pdf-document'
import type { DevisPdfModel } from '@/view-models/devis-pdf-model'

export async function renderDevisPdf(model: DevisPdfModel): Promise<Buffer> {
  return renderToBuffer(<DevisPdfDocument model={model} />)
}
