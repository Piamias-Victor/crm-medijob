'use client'

import Link from 'next/link'
import { INTERVIEW_MODE_LABELS } from '@/view-models/interview-labels'
import { interviewTemplateEditorHref } from '@/view-models/job-title-trame-cards'
import { INTERVIEW_TEMPLATE_TITLE } from '@/view-models/interview-template-admin-copy'
import { accentButtonClassName, primaryButtonClassName } from '@/lib/button-styles'
import { cn } from '@/lib/cn'

const compact = 'px-3 py-1.5 text-xs shadow-sm'

export function JobTitleTrameLinks({ profileKey }: { profileKey: string | null }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-fg-muted">{INTERVIEW_TEMPLATE_TITLE}</p>
      <div className="flex flex-wrap gap-2">
        <Link
          href={interviewTemplateEditorHref(profileKey, 'INTERIM')}
          className={cn(accentButtonClassName, compact)}
        >
          {INTERVIEW_MODE_LABELS.INTERIM}
        </Link>
        <Link
          href={interviewTemplateEditorHref(profileKey, 'CDD_CDI')}
          className={cn(primaryButtonClassName, compact)}
        >
          {INTERVIEW_MODE_LABELS.CDD_CDI}
        </Link>
      </div>
    </div>
  )
}
