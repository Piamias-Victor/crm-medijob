import { badakanGetRecipient, badakanLogin } from './auth'
import { downloadBadakanFile } from './download-file'
import { identityFileRefs, type IdentityDocCategory } from './identity-file-refs'
import { mapBadakanRecipient } from './map-recipient'
import type { ResumeFile } from './fetch-resume'

export type IdentityFile = ResumeFile & { category: IdentityDocCategory }

export type BadakanDossier = {
  resume: ResumeFile | null
  files: IdentityFile[]
  nir: string | null
  iban: string | null
}

export async function fetchBadakanDossier(input: {
  baseUrl: string
  email: string
  password: string
  badakanId: string
  fetchFn?: typeof fetch
}): Promise<BadakanDossier | null> {
  const fetchFn = input.fetchFn ?? fetch
  const token = await badakanLogin(input.baseUrl, input.email, input.password, fetchFn)
  const detail = await badakanGetRecipient(input.baseUrl, token, input.badakanId, fetchFn)
  const mapped = mapBadakanRecipient(detail)
  if (!mapped) return null
  const resumeUrl = mapped.snapshot.documents?.RESUME?.rectoUrl
  const resume = resumeUrl
    ? await downloadBadakanFile(
        fetchFn,
        token,
        resumeUrl,
        mapped.snapshot.documents?.RESUME?.rectoFormat,
        'cv',
      )
    : null
  const files: IdentityFile[] = []
  for (const ref of identityFileRefs(mapped.snapshot)) {
    const file = await downloadBadakanFile(fetchFn, token, ref.url, ref.format, ref.filenameStem)
    files.push({ ...file, category: ref.category })
  }
  return { resume, files, nir: mapped.nir, iban: mapped.iban }
}
