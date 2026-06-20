import { renderToBuffer } from '@react-pdf/renderer'
import { AnonymizedProfileDocument } from './anonymized-profile-document'

export async function renderAnonymizedProfilePdf(content: string): Promise<Buffer> {
  return renderToBuffer(<AnonymizedProfileDocument content={content} />)
}
