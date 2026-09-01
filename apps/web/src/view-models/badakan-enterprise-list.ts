export type BadakanEnterpriseListSource = {
  id: string
  name: string
  siret: string | null
  city: string | null
}

export type BadakanEnterpriseListItem = {
  id: string
  name: string
  siretLabel: string
  cityLabel: string
  href: string
}

export function toBadakanEnterpriseListItem(
  row: BadakanEnterpriseListSource,
): BadakanEnterpriseListItem {
  return {
    id: row.id,
    name: row.name,
    siretLabel: row.siret?.trim() || 'SIRET absent',
    cityLabel: row.city?.trim() || '—',
    href: `/interim/officines/${row.id}`,
  }
}

export function toBadakanEnterpriseListItems(rows: BadakanEnterpriseListSource[]) {
  return rows.map(toBadakanEnterpriseListItem)
}
