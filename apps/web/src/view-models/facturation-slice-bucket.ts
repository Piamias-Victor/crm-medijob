export type FacturationSliceBucket = {
  key: string
  label: string
  ca: number
  marge: number
}

export type FacturationSlices = {
  byReferent: FacturationSliceBucket[]
  byPharmacy: FacturationSliceBucket[]
  byContract: FacturationSliceBucket[]
  byMonth: FacturationSliceBucket[]
}

export const EMPTY_FACTURATION_SLICES: FacturationSlices = {
  byReferent: [],
  byPharmacy: [],
  byContract: [],
  byMonth: [],
}
