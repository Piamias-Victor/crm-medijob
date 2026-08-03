import type { PharmacyDeps } from '@/server/routers/pharmacy.deps'
import type {
  DetectPharmacyDuplicateInput,
  PharmacyMergeInput,
} from '@/view-models/pharmacy-duplicate.schema'
import type { PharmacyCsvImportRow } from '@/view-models/pharmacy-csv-import.schema'
import { detectPharmacyDuplicates } from '@/server/pharmacy/detect-pharmacy-duplicates'
import { mergePharmacy } from '@/server/pharmacy/merge-pharmacy'
import { commitPharmacyImport } from '@/server/pharmacy/commit-pharmacy-import'

function duplicateLookups(deps: PharmacyDeps) {
  return {
    findIdentityBySiret: deps.findIdentityBySiret,
    findIdentityByNameCityPostal: deps.findIdentityByNameCityPostal,
  }
}

export function handleDetectPharmacyDuplicate(
  deps: PharmacyDeps,
  input: DetectPharmacyDuplicateInput,
) {
  return detectPharmacyDuplicates(input, duplicateLookups(deps))
}

export function handleMergePharmacy(deps: PharmacyDeps, input: PharmacyMergeInput) {
  return mergePharmacy(input, {
    detectDuplicates: (probe) => detectPharmacyDuplicates(probe, duplicateLookups(deps)),
    mergePharmacies: deps.mergePharmacies,
  })
}

export function handleCommitPharmacyImport(deps: PharmacyDeps, rows: PharmacyCsvImportRow[]) {
  return commitPharmacyImport(rows, {
    detectDuplicates: (probe) => detectPharmacyDuplicates(probe, duplicateLookups(deps)),
    create: deps.pharmacies.create,
  })
}
