import { INTERVIEW_CRITERIA_LABELS } from '@/view-models/interview-criteria-labels'
import {
  INTERVIEW_CLOSE_MAPPING_LABELS,
  INTERVIEW_CLOSE_MAPPINGS,
} from '@/view-models/interview-close-mapping'
import { INTERVIEW_TEMPLATE_CRITERION_NONE } from '@/view-models/interview-template-admin-copy'

export const INTERVIEW_MAPPING_OPTIONS = INTERVIEW_CLOSE_MAPPINGS.map((value) => ({
  value,
  label: INTERVIEW_CLOSE_MAPPING_LABELS[value],
}))

export const INTERVIEW_CRITERION_OPTIONS = [
  { value: '', label: INTERVIEW_TEMPLATE_CRITERION_NONE },
  ...Object.entries(INTERVIEW_CRITERIA_LABELS).map(([value, name]) => ({
    value,
    label: `${value} — ${name}`,
  })),
]
