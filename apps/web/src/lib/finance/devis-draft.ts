import { calculateInterimLibre, roundMoney, ttcFromHt } from './calculate-interim-libre'

export const DEVIS_KINDS = ['INTERIM', 'CDD', 'CDI'] as const
export type DevisKind = (typeof DEVIS_KINDS)[number]
export type HtSource = 'ENGINE' | 'TYPED'
export type LinkedField = 'hours' | 'hourlyRate' | 'amountHt'

export type DevisDraftState = {
  kind: DevisKind
  hours: number | null
  hourlyRate: number | null
  amountHt: number | null
  amountTtc: number | null
  htSource: HtSource
}

export function applyLinkedAmounts(state: DevisDraftState, changed: LinkedField): DevisDraftState {
  if (changed === 'amountHt') return fromHt(state)
  if (changed === 'hourlyRate') return fromRate(state)
  if (state.hourlyRate != null) return fromRate(state)
  return fromHt(state)
}

function fromRate(state: DevisDraftState): DevisDraftState {
  if (state.hours == null || state.hourlyRate == null) return state
  return {
    ...state,
    ...calculateInterimLibre({ hours: state.hours, hourlyRate: state.hourlyRate }),
    htSource: 'ENGINE',
  }
}

function fromHt(state: DevisDraftState): DevisDraftState {
  if (state.hours == null || state.hours === 0 || state.amountHt == null) {
    return {
      ...state,
      amountTtc: state.amountHt == null ? null : ttcFromHt(state.amountHt),
      htSource: 'TYPED',
    }
  }
  return {
    ...state,
    hourlyRate: roundMoney(state.amountHt / state.hours),
    amountTtc: ttcFromHt(state.amountHt),
    htSource: 'TYPED',
  }
}
