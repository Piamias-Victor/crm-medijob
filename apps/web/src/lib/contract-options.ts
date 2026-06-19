import { CONTRACT_TYPES } from '@/view-models/candidate-profile.schema'
import { CONTRACT_TYPE_LABELS } from '@/lib/candidate-options'

export const contractOptions = CONTRACT_TYPES.map((value) => ({
  value,
  label: CONTRACT_TYPE_LABELS[value],
}))
