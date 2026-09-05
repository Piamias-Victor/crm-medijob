import { FRENCH_DEPARTMENT_OPTIONS } from '@/lib/constants/french-department-options'
import { matchesSelection, matchesText } from '@/lib/filters/badakan-filter-match'
import { badakanMissionStepOptions } from '@/view-models/badakan-mission-step'
import { badakanContractStatusOptions } from '@/view-models/badakan-contract-status'
import type { FilterConfig, FilterValues } from '@/lib/filters/filter-types'
import type { BadakanNeedListItem } from '@/view-models/badakan-need-list'
import type { BadakanMissionListItem } from '@/view-models/badakan-mission-list'
import type { BadakanContractListItem } from '@/view-models/badakan-contract-list'
import type { BadakanEnterpriseListItem } from '@/view-models/badakan-enterprise-list'

function matchesDepartment(postalCode: string | null, departments: string[]): boolean {
  if (departments.length === 0) return true
  if (!postalCode?.trim()) return false
  return departments.some((code) => postalCode.trim().startsWith(code))
}

export const missionFilterConfig = [
  { id: 'q', type: 'text', label: 'Recherche', placeholder: 'Officine…', wide: true },
  { id: 'steps', type: 'multi-select', label: 'Statut', options: badakanMissionStepOptions },
] as const satisfies readonly FilterConfig[]

export const needFilterConfig = [
  { id: 'q', type: 'text', label: 'Recherche', placeholder: 'Officine, LGO…', wide: true },
  { id: 'steps', type: 'multi-select', label: 'Étape', options: badakanMissionStepOptions },
  { id: 'ville', type: 'text', label: 'Ville', placeholder: 'Ville…' },
  {
    id: 'departement',
    type: 'multi-select',
    label: 'Département',
    unit: 'dpt',
    options: FRENCH_DEPARTMENT_OPTIONS,
  },
  { id: 'metier', type: 'text', label: 'Métier', placeholder: 'Pharmacien…' },
] as const satisfies readonly FilterConfig[]

export const contractFilterConfig = [
  { id: 'q', type: 'text', label: 'Recherche', placeholder: 'Candidat, officine…', wide: true },
  { id: 'statuses', type: 'multi-select', label: 'Statut', options: badakanContractStatusOptions },
] as const satisfies readonly FilterConfig[]

export const enterpriseFilterConfig = [
  { id: 'q', type: 'text', label: 'Recherche', placeholder: 'Nom, ville, SIRET…', wide: true },
] as const satisfies readonly FilterConfig[]

export function matchesMission(
  row: BadakanMissionListItem,
  values: FilterValues<typeof missionFilterConfig>,
): boolean {
  return (
    matchesText([row.pharmacyName, row.stepLabel, row.periodLabel], values.q) &&
    matchesSelection(row.step, values.steps)
  )
}

export function matchesNeed(
  row: BadakanNeedListItem,
  values: FilterValues<typeof needFilterConfig>,
): boolean {
  return (
    matchesText([row.pharmacyName, row.softwareLabel], values.q) &&
    matchesSelection(row.step, values.steps) &&
    matchesText([row.cityLabel], values.ville) &&
    matchesDepartment(row.postalCode, values.departement) &&
    matchesText([row.jobTitleLabel], values.metier)
  )
}

export function matchesContract(
  row: BadakanContractListItem,
  values: FilterValues<typeof contractFilterConfig>,
): boolean {
  return (
    matchesText([row.recipientName, row.pharmacyName, row.statusLabel], values.q) &&
    matchesSelection(row.status, values.statuses)
  )
}

export function matchesEnterprise(
  row: BadakanEnterpriseListItem,
  values: FilterValues<typeof enterpriseFilterConfig>,
): boolean {
  return matchesText([row.name, row.cityLabel, row.siretLabel], values.q)
}
