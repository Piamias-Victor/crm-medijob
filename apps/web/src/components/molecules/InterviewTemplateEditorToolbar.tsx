'use client'

import Link from 'next/link'
import { Button } from '@/components/atoms/Button'
import {
  INTERVIEW_TEMPLATE_ADD_SECTION,
  INTERVIEW_TEMPLATE_BACK,
  INTERVIEW_TEMPLATE_PUBLISH,
  INTERVIEW_TEMPLATE_SAVE,
} from '@/view-models/interview-template-admin-copy'

type Props = {
  saving: boolean
  publishing: boolean
  onSave: () => void
  onPublish: () => void
  onAddSection: () => void
}

export function InterviewTemplateEditorToolbar({
  saving,
  publishing,
  onSave,
  onPublish,
  onAddSection,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
      <Link href="/admin/metiers" className="text-sm text-fg-muted hover:text-fg">
        {INTERVIEW_TEMPLATE_BACK}
      </Link>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={onAddSection}>
          {INTERVIEW_TEMPLATE_ADD_SECTION}
        </Button>
        <Button type="button" variant="primary" disabled={saving} onClick={onSave}>
          {INTERVIEW_TEMPLATE_SAVE}
        </Button>
        <Button type="button" variant="accent" disabled={publishing} onClick={onPublish}>
          {INTERVIEW_TEMPLATE_PUBLISH}
        </Button>
      </div>
    </div>
  )
}
