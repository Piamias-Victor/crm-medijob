import { notFound } from 'next/navigation'
import { createServerCaller } from '@/lib/trpc/server'
import { InterviewTemplateEditor } from '@/components/organisms/InterviewTemplateEditor'

type Props = { params: Promise<{ profileKey: string; mode: string }> }

function isNotFoundError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'NOT_FOUND'
}

export default async function AdminMetierTrameEditorPage({ params }: Props) {
  const { profileKey: rawKey, mode } = await params
  const profileKey = decodeURIComponent(rawKey)
  if (mode !== 'INTERIM' && mode !== 'CDD_CDI') notFound()
  const caller = await createServerCaller()
  try {
    const copy = await caller.admin.interviewTemplate.getWorkingCopy({ profileKey, mode })
    return <InterviewTemplateEditor copy={copy} />
  } catch (error) {
    if (isNotFoundError(error)) notFound()
    throw error
  }
}
