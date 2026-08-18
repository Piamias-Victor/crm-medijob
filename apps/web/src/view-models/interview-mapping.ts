import {
  extractAvailableFrom,
  extractMobilityRadiusKm,
  extractSalaryExpectations,
  extractSoftwareNames,
  shouldMapContracts,
  type MappingQuestion,
} from '@/view-models/interview-mapping-extract'
import {
  isMappingEmpty,
  type InterviewMappingDiff,
  type InterviewMappingField,
  type InterviewMappingProfile,
} from '@/view-models/interview-mapping-types'
import type { InterviewDraftAnswers } from '@/view-models/interview-draft.schema'

type Ctx = { mode: 'INTERIM' | 'CDD_CDI'; questions: MappingQuestion[] }

function same(left: unknown, right: unknown): boolean {
  if (left instanceof Date && right instanceof Date) return left.getTime() === right.getTime()
  if (Array.isArray(left) && Array.isArray(right)) {
    return left.length === right.length && left.every((item, index) => item === right[index])
  }
  return left === right
}

function pushDiff(
  diffs: InterviewMappingDiff[],
  field: InterviewMappingField,
  current: unknown,
  next: unknown,
) {
  if (next === undefined || same(current, next) || isMappingEmpty(next)) return
  diffs.push({ field, current, next, kind: isMappingEmpty(current) ? 'fill' : 'overwrite' })
}

export function diffInterviewMapping(
  answers: InterviewDraftAnswers,
  profile: InterviewMappingProfile,
  ctx: Ctx,
): InterviewMappingDiff[] {
  const diffs: InterviewMappingDiff[] = []
  pushDiff(diffs, 'availableFrom', profile.availableFrom, extractAvailableFrom(answers, ctx.questions))
  pushDiff(
    diffs,
    'mobilityRadiusKm',
    profile.mobilityRadiusKm,
    extractMobilityRadiusKm(answers, ctx.questions),
  )
  pushDiff(
    diffs,
    'salaryExpectations',
    profile.salaryExpectations,
    extractSalaryExpectations(answers, ctx.questions),
  )
  pushDiff(diffs, 'softwareNames', profile.softwareNames, extractSoftwareNames(answers, ctx.questions))
  if (shouldMapContracts(ctx.questions)) {
    const contracts = ctx.mode === 'INTERIM' ? ['INTERIM'] : ['CDI', 'CDD']
    pushDiff(diffs, 'contractTypes', profile.contractTypes, contracts)
  }
  return diffs
}
