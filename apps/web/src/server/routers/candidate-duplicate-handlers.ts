import type { CandidateDeps } from '@/server/routers/candidate.deps'
import type { DetectDuplicateInput } from '@/view-models/candidate-duplicate.schema'
import type { CandidateMergeInput } from '@/view-models/candidate-duplicate.schema'
import { detectCandidateDuplicates } from '@/server/candidate/detect-candidate-duplicates'
import { mergeCandidate } from '@/server/candidate/merge-candidate'

function duplicateDeps(deps: CandidateDeps) {
  return {
    findIdentityByEmail: deps.findIdentityByEmail,
    findIdentityByNamePhone: deps.findIdentityByNamePhone,
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
