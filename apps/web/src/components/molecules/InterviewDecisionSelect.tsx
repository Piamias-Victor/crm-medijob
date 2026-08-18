'use client'

import { SectionCard } from '@/components/molecules/SectionCard'
import { INTERVIEW_DECISION_OPTIONS } from '@/view-models/interview-labels'
import { INTERVIEW_DECISION_HINT, INTERVIEW_DECISION_TITLE } from '@/view-models/interview-copy'
import { pillNavLinkClass } from '@/view-models/pill-nav-link'
import type { InterviewCloseInput } from '@/view-models/interview-close.schema'

type Props = {
  value: InterviewCloseInput['decision']
  onChange: (value: InterviewCloseInput['decision']) => void
}

export function InterviewDecisionSelect({ value, onChange }: Props) {
  return (
    <SectionCard
      variant="glass"
      title={INTERVIEW_DECISION_TITLE}
      description={INTERVIEW_DECISION_HINT}
      bodyClassName="p-4 sm:p-5"
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label={INTERVIEW_DECISION_TITLE}>
        {INTERVIEW_DECISION_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={pillNavLinkClass(value === option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </SectionCard>
  )
}
