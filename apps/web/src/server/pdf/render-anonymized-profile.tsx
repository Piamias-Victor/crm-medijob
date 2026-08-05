import { renderToBuffer } from '@react-pdf/renderer'
import {
  nonEmptyAnonymizedSections,
  parseAnonymizedDossier,
} from '@/view-models/anonymized-dossier'
import { AnonymizedProfileDocument } from './anonymized-profile-document'

export async function renderAnonymizedProfilePdf(raw: string): Promise<Buffer> {
  const dossier = parseAnonymizedDossier(raw)
  if (!dossier) throw new Error('ANONYMIZED_DOSSIER_INVALID')
  const sections = nonEmptyAnonymizedSections(dossier)
  return renderToBuffer(<AnonymizedProfileDocument sections={sections} />)
}
