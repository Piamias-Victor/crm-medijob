'use client'

import Link from 'next/link'
import { INTERVIEW_MODE_LABELS } from '@/view-models/interview-labels'
import {
  interviewTemplateEditorHref,
  jobTitleTrameKind,
} from '@/view-models/job-title-trame-cards'
import { INTERVIEW_TEMPLATE_CREATE } from '@/view-models/interview-template-admin-copy'
import { accentButtonClassName, primaryButtonClassName } from '@/lib/button-styles'
import { cn } from '@/lib/cn'
import type { InterviewTemplatePairStatus } from '@/view-models/interview-template-pairs'
import type { RefItem } from '@/view-models/referential'

const compact = 'px-3 py-1.5 text-xs shadow-sm'
export const JOB_TITLE_TRAME_MODES = ['INTERIM', 'CDD_CDI'] as const
export type JobTitleTrameMode = (typeof JOB_TITLE_TRAME_MODES)[number]

type Props = {
  item: RefItem
  pairs: InterviewTemplatePairStatus[]
  onCreate: (mode: JobTitleTrameMode) => void
}

export function JobTitleModeButtons({ item, pairs, onCreate }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {JOB_TITLE_TRAME_MODES.map((current) => {
        const kind = jobTitleTrameKind(item.profileKey ?? null, current, pairs)
        const className = cn(
          current === 'INTERIM' ? accentButtonClassName : primaryButtonClassName,
          compact,
        )
        if (kind === 'edit') {
          return (
            <Link key={current} href={interviewTemplateEditorHref(item.profileKey, current)} className={className}>
              {INTERVIEW_MODE_LABELS[current]}
            </Link>
          )
        }
        return (
          <button key={current} type="button" className={className} onClick={() => onCreate(current)}>
            {INTERVIEW_TEMPLATE_CREATE} {INTERVIEW_MODE_LABELS[current]}
          </button>
        )
      })}
    </div>
  )
}
