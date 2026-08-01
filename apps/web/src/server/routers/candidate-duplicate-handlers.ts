import type { CandidateDeps } from '@/server/routers/candidate.deps'
import type { DetectDuplicateInput } from '@/view-models/candidate-duplicate.schema'
import type { CandidateMergeInput } from '@/view-models/candidate-duplicate.schema'
import type { CandidateCsvImportRow } from '@/view-models/candidate-csv-import.schema'
import { detectCandidateDuplicates } from '@/server/candidate/detect-candidate-duplicates'
import { detectCandidateImportDuplicates } from '@/server/candidate/detect-candidate-import-duplicates'
import { commitCandidateImport } from '@/server/candidate/commit-candidate-import'
import { mergeCandidate } from '@/server/candidate/merge-candidate'

function duplicateDeps(deps: CandidateDeps) {
  return {
    findIdentityByEmail: deps.findIdentityByEmail,
    findIdentityByNamePhone: deps.findIdentityByNamePhone,
  }
}

function importDuplicateDeps(deps: CandidateDeps) {
  return {
    findIdentityByEmail: deps.findIdentityByEmailAny,
    findIdentityByPhone: deps.findIdentityByPhoneAny,
  }
}

export function handleDetectDuplicate(deps: CandidateDeps, input: DetectDuplicateInput) {
  return detectCandidateDuplicates(input, duplicateDeps(deps))
}

export function handleMergeCandidate(deps: CandidateDeps, input: CandidateMergeInput) {
  return mergeCandidate(input, {
    detectDuplicates: (probe) => detectCandidateDuplicates(probe, duplicateDeps(deps)),
    mergeCandidates: deps.mergeCandidates,
  })
}

export function handleCommitCandidateImport(deps: CandidateDeps, rows: CandidateCsvImportRow[]) {
  return commitCandidateImport(rows, {
    detectDuplicates: (probe) => detectCandidateImportDuplicates(probe, importDuplicateDeps(deps)),
    create: deps.createProfile,
  })
}
