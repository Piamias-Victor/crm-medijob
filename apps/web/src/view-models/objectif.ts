export type Objectif = {
  monthlyCaPlacement: number
  monthlyMargePlacement: number
  monthlyCaInterim: number
  monthlyMargeInterim: number
  monthlyRentabilityThreshold: number
}

export const DEFAULT_OBJECTIF: Objectif = {
  monthlyCaPlacement: 20_000,
  monthlyMargePlacement: 20_000,
  monthlyCaInterim: 30_000,
  monthlyMargeInterim: 10_000,
  monthlyRentabilityThreshold: 15_000,
}

export const OBJECTIF_SINGLETON_ID = 'default'

export function annualFromMonthly(monthly: number): number {
  return monthly * 12
}

export const OBJECTIF_SAVE_TOAST = 'Objectifs enregistrés'

export const OBJECTIF_FIELDS = [
  { name: 'monthlyCaPlacement', label: 'CA Placement mensuel (€)' },
  { name: 'monthlyMargePlacement', label: 'Marge Placement mensuel (€)' },
  { name: 'monthlyCaInterim', label: 'CA Intérim mensuel (€)' },
  { name: 'monthlyMargeInterim', label: 'Marge Intérim mensuel (€)' },
  { name: 'monthlyRentabilityThreshold', label: 'Seuil de rentabilité mensuel (€)' },
] as const
