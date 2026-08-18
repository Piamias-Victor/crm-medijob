'use client'

import Link from 'next/link'
import { INTERVIEW_MODE_LABELS } from '@/view-models/interview-labels'
import { interviewTemplateEditorHref } from '@/view-models/job-title-trame-cards'
import {
  INTERVIEW_TEMPLATE_GENERIC_HINT,
  INTERVIEW_TEMPLATE_GENERIC_TITLE,
} from '@/view-models/interview-template-admin-copy'
import { accentButtonClassName, primaryButtonClassName } from '@/lib/button-styles'
import { cn } from '@/lib/cn'

const compact = 'px-3 py-1.5 text-xs shadow-sm'

export function GenericTrameCard() {
  return (
    <li className="flex flex-col gap-4 rounded-xl border border-dashed border-border bg-white/60 p-4">
      <div>
        <h3 className="text-sm font-semibold text-fg">{INTERVIEW_TEMPLATE_GENERIC_TITLE}</h3>
        <p className="mt-1 text-xs text-fg-muted">{INTERVIEW_TEMPLATE_GENERIC_HINT}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href={interviewTemplateEditorHref(null, 'INTERIM')} className={cn(accentButtonClassName, compact)}>
          {INTERVIEW_MODE_LABELS.INTERIM}
        </Link>
        <Link href={interviewTemplateEditorHref(null, 'CDD_CDI')} className={cn(primaryButtonClassName, compact)}>
          {INTERVIEW_MODE_LABELS.CDD_CDI}
        </Link>
      </div>
    </li>
  )
}
