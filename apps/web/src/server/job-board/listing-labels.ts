import type { ContractType } from '@prisma/client'

const CONTRACT_LABEL: Record<ContractType, string> = {
  CDI: 'CDI',
  CDD: 'CDD',
  INTERIM: 'Intérim',
  VACATION: 'Vacation',
}

export function boardContractLabel(type: ContractType) {
  return CONTRACT_LABEL[type]
}

export function boardHoursLabel(tempsPlein: boolean) {
  return tempsPlein ? 'Temps plein' : 'Temps partiel'
}

export function boardDepartement(postalCode: string | null) {
  const digits = postalCode?.trim() ?? ''
  if (!/^\d{5}$/.test(digits)) return null
  return digits.slice(0, 2)
}

export function boardListingSlug(title: string, city: string) {
  return `${title} ${city}`
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
