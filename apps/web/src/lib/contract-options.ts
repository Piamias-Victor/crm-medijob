import { CONTRACT_TYPES, CREATE_CONTRACT_TYPES } from '@/view-models/candidate-profile.schema'
import { CONTRACT_TYPE_LABELS } from '@/lib/candidate-options'

export const contractOptions = CONTRACT_TYPES.map((value) => ({
  value,
  label: CONTRACT_TYPE_LABELS[value],
}))

export const createContractOptions = CREATE_CONTRACT_TYPES.map((value) => ({
  value,
  label: CONTRACT_TYPE_LABELS[value],
}))
