import type { BadakanRecipientRaw } from './map-recipient.schema'

export type IdentityDocCategory = 'CNI' | 'RIB' | 'DIPLOME'

export type IdentityFileRef = {
  category: IdentityDocCategory
  url: string
  format: string | undefined
  filenameStem: string
}

type DocFile = {
  rectoUrl?: string
  versoUrl?: string
  rectoFormat?: string
  versoFormat?: string
}

function sides(category: IdentityDocCategory, stem: string, file: DocFile | undefined): IdentityFileRef[] {
  if (!file) return []
  const out: IdentityFileRef[] = []
  if (file.rectoUrl) {
    out.push({ category, url: file.rectoUrl, format: file.rectoFormat, filenameStem: `${stem}-recto` })
  }
  if (file.versoUrl) {
    out.push({ category, url: file.versoUrl, format: file.versoFormat, filenameStem: `${stem}-verso` })
  }
  return out
}

export function identityFileRefs(snapshot: BadakanRecipientRaw): IdentityFileRef[] {
  const docs = snapshot.documents
  if (!docs) return []
  return [
    ...sides('CNI', 'cni', docs.NATIONAL_ID_CARD),
    ...sides('RIB', 'rib', docs.RIB),
    ...sides('DIPLOME', 'diplome', docs.DIPLOMA),
  ]
}
