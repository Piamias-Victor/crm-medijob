import { calculateInterimLibre, ttcFromHt } from './calculate-interim-libre'

export const DEVIS_KINDS = ['INTERIM', 'CDD', 'CDI'] as const
export type DevisKind = (typeof DEVIS_KINDS)[number]
export type HtSource = 'ENGINE' | 'TYPED'

export type DevisDraftState = {
  kind: DevisKind
  hours: number | null
  hourlyRate: number | null
  amountHt: number | null
  amountTtc: number | null
  htSource: HtSource
}

export function emptyInterimDraft(
  seed: Pick<DevisDraftState, 'hours' | 'hourlyRate'>,
): DevisDraftState {
  return {
    kind: 'INTERIM',
    hours: seed.hours,
    hourlyRate: seed.hourlyRate,
    amountHt: null,
    amountTtc: null,
    htSource: 'ENGINE',
  }
}

export function applyHours(state: DevisDraftState, hours: number | null): DevisDraftState {
  return { ...state, hours }
}

export function applyTypedHt(state: DevisDraftState, amountHt: number): DevisDraftState {
  return { ...state, amountHt, amountTtc: ttcFromHt(amountHt), htSource: 'TYPED' }
}

export function applyCalculate(state: DevisDraftState): DevisDraftState {
  if (state.kind !== 'INTERIM') return state
  if (state.hours == null || state.hourlyRate == null) return state
  return {
    ...state,
    ...calculateInterimLibre({ hours: state.hours, hourlyRate: state.hourlyRate }),
    htSource: 'ENGINE',
  }
}
