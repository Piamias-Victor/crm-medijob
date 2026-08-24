import { z } from 'zod'

const monthlyAmount = z.number().finite().positive('Montant positif requis')

export const objectifSchema = z.object({
  monthlyCaPlacement: monthlyAmount,
  monthlyMargePlacement: monthlyAmount,
  monthlyCaInterim: monthlyAmount,
  monthlyMargeInterim: monthlyAmount,
  monthlyRentabilityThreshold: monthlyAmount,
})

export type ObjectifInput = z.infer<typeof objectifSchema>
