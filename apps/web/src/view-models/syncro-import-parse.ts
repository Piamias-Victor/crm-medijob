import type { SyncroSheetRow } from './syncro-import.types'

const COL = {
  ID: 'ID',
  TELEPHONE: 'TELEPHONE',
  PRENOM: 'PRENOM',
  NOM: 'NOM',
  EMAIL: 'EMAIL',
  PROFIL: 'PROFIL',
  METIER: 'METIER',
  CP: 'CP',
  VILLE: 'VILLE',
  ADRESSE: 'ADRESSE',
  VALIDE: 'VALIDE',
  ATTRIBUE_A: 'ATTRIBUE A',
  STATUT: 'STATUT',
  DERNIER_APPEL: 'DERNIER APPEL',
  APPEL_PAR: 'APPEL PAR',
  RESULTAT: 'RESULTAT',
  RDV_LE: 'RDV LE',
  NOTES: 'NOTES',
  RELANCE: '_RELANCE',
} as const

function str(v: unknown): string | null {
  if (v == null || v === '') return null
  if (typeof v === 'number') return String(v).replace(/\.0$/, '')
  if (v instanceof Date) return v.toISOString()
  return String(v)
}

function headerIndex(headers: unknown[]): Map<string, number> {
  const map = new Map<string, number>()
  headers.forEach((h, i) => {
    const key = String(h ?? '').trim()
    if (key) map.set(key, i)
    else if (!map.has('CP')) map.set('CP', i)
  })
  return map
}

function cell(row: unknown[], idx: Map<string, number>, key: string): string | null {
  const i = idx.get(key)
  if (i == null) return null
  return str(row[i])
}

export function parseSyncroCandidatsRows(matrix: unknown[][]): SyncroSheetRow[] {
  if (matrix.length < 2) return []
  const idx = headerIndex(matrix[0]!)
  const out: SyncroSheetRow[] = []
  for (const row of matrix.slice(1)) {
    const id = cell(row, idx, COL.ID)
    const prenom = cell(row, idx, COL.PRENOM)
    const nom = cell(row, idx, COL.NOM)
    if (!id || !prenom || !nom) continue
    out.push({
      id,
      prenom,
      nom,
      telephone: cell(row, idx, COL.TELEPHONE),
      email: cell(row, idx, COL.EMAIL),
      profil: cell(row, idx, COL.PROFIL),
      metier: cell(row, idx, COL.METIER),
      cp: cell(row, idx, COL.CP),
      ville: cell(row, idx, COL.VILLE),
      adresse: cell(row, idx, COL.ADRESSE),
      valide: cell(row, idx, COL.VALIDE),
      attribueA: cell(row, idx, COL.ATTRIBUE_A),
      statut: cell(row, idx, COL.STATUT),
      dernierAppel: cell(row, idx, COL.DERNIER_APPEL),
      appelPar: cell(row, idx, COL.APPEL_PAR),
      resultat: cell(row, idx, COL.RESULTAT),
      rdvLe: cell(row, idx, COL.RDV_LE),
      notes: cell(row, idx, COL.NOTES),
      relance: cell(row, idx, COL.RELANCE),
    })
  }
  return out
}
