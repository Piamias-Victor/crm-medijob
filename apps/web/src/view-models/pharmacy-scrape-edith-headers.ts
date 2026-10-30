const REQUIRED = ['provenance', 'date', 'nom', 'cp', 'ville', 'mail'] as const

export function assertEdithHeaders(headers: string[]): void {
  const normalized = headers.map((h) => h.trim().toLowerCase())
  const ok = REQUIRED.every((name, i) => normalized[i] === name)
  if (!ok) {
    throw new Error(
      'Format EDITH invalide — colonnes attendues : Provenance, Date, Nom, CP, Ville, Mail',
    )
  }
}

export function headerIndex(headers: string[], name: string): number {
  return headers.findIndex((h) => h.trim().toLowerCase() === name)
}
