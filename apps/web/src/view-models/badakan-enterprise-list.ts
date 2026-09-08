export type BadakanEnterpriseListSource = {
  id: string
  name: string
  siret: string | null
  city: string | null
}

export type EnterpriseBlockKind = 'missing_siret' | 'siret_taken' | 'ready'

export type BadakanEnterpriseListItem = {
  id: string
  name: string
  siretLabel: string
  cityLabel: string
  href: string
  blockKind: EnterpriseBlockKind
  blockLabel: string
}

type ExistingPharmacy = { id: string; name: string } | null | undefined

export function toEnterpriseBlock(
  siret: string | null,
  existing?: ExistingPharmacy,
): { kind: EnterpriseBlockKind; label: string } {
  if (!siret?.trim()) return { kind: 'missing_siret', label: 'SIRET manquant' }
  if (existing) return { kind: 'siret_taken', label: 'SIRET déjà dans le CRM' }
  return { kind: 'ready', label: 'Prêt' }
}

export function toBadakanEnterpriseListItem(
  row: BadakanEnterpriseListSource,
  existing?: ExistingPharmacy,
): BadakanEnterpriseListItem {
  const block = toEnterpriseBlock(row.siret, existing)
  return {
    id: row.id,
    name: row.name,
    siretLabel: row.siret?.trim() || 'SIRET absent',
    cityLabel: row.city?.trim() || '—',
    href: `/interim/officines/${row.id}`,
    blockKind: block.kind,
    blockLabel: block.label,
  }
}

export function toBadakanEnterpriseListItems(
  rows: BadakanEnterpriseListSource[],
  existingBySiret: Map<string, { id: string; name: string }> = new Map(),
) {
  const order: Record<EnterpriseBlockKind, number> = {
    missing_siret: 0,
    siret_taken: 1,
    ready: 2,
  }
  return rows
    .map((row) => {
      const key = row.siret?.trim()
      return toBadakanEnterpriseListItem(row, key ? existingBySiret.get(key) : null)
    })
    .sort((a, b) => order[a.blockKind] - order[b.blockKind])
}

export function enterpriseBlockVariant(kind: EnterpriseBlockKind) {
  if (kind === 'missing_siret') return 'error' as const
  if (kind === 'siret_taken') return 'warning' as const
  return 'success' as const
}
