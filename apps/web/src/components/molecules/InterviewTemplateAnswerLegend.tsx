import {
  INTERVIEW_TEMPLATE_ANSWER_HINT,
  INTERVIEW_TEMPLATE_ANSWER_LABEL,
  INTERVIEW_TEMPLATE_ANSWER_TEXT,
  INTERVIEW_TEMPLATE_POINTS,
  INTERVIEW_TEMPLATE_REMOVE,
} from '@/view-models/interview-template-admin-copy'

export function InterviewTemplateAnswerLegend() {
  return (
    <div className="space-y-1">
      <p className="text-xs leading-relaxed text-fg-muted">{INTERVIEW_TEMPLATE_ANSWER_HINT}</p>
      <div className="hidden gap-2 text-xs font-medium text-fg-muted sm:grid sm:grid-cols-[1fr_2fr_5rem_auto]">
        <span>{INTERVIEW_TEMPLATE_ANSWER_LABEL}</span>
        <span>{INTERVIEW_TEMPLATE_ANSWER_TEXT}</span>
        <span>{INTERVIEW_TEMPLATE_POINTS}</span>
        <span className="sr-only">{INTERVIEW_TEMPLATE_REMOVE}</span>
      </div>
    </div>
  )
}
