export const TVA_RATE = 0.2

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100
}

export function ttcFromHt(amountHt: number): number {
  return roundMoney(amountHt * (1 + TVA_RATE))
}

export function calculateInterimLibre(input: { hours: number; hourlyRate: number }): {
  amountHt: number
  amountTtc: number
} {
  const amountHt = roundMoney(input.hours * input.hourlyRate)
  return { amountHt, amountTtc: ttcFromHt(amountHt) }
}
