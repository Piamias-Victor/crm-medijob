'use client'

import type { UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { PublicApplyField } from '@/components/molecules/PublicApplyField'
import type { usePublicApplyCv } from '@/components/molecules/use-public-apply-cv'
import { PUBLIC_APPLY_CV_ACCEPT, PUBLIC_APPLY_CV_HINT } from '@/lib/public-apply-cv'
import { PUBLIC_APPLY_COPY } from '@/view-models/public-apply-copy'
import type { PublicApplyFormValues } from '@/view-models/public-apply.schema'

type Props = {
  form: UseFormReturn<PublicApplyFormValues>
  cv: ReturnType<typeof usePublicApplyCv>
  privacyUrl: string
  retentionLabel: string
  submitting: boolean
}

export function PublicApplyCvConsent({
  form,
  cv,
  privacyUrl,
  retentionLabel,
  submitting,
}: Props) {
  return (
    <>
      <PublicApplyField label={PUBLIC_APPLY_COPY.fields.cv} error={cv.error ?? undefined}>
        <Input
          className="min-h-11"
          type="file"
          accept={PUBLIC_APPLY_CV_ACCEPT}
          onChange={(event) => void cv.onFileChange(event.target.files)}
        />
        <p className="text-xs text-fg-muted">{PUBLIC_APPLY_CV_HINT}</p>
      </PublicApplyField>
      <PublicApplyField label={PUBLIC_APPLY_COPY.fields.message}>
        <textarea
          className="min-h-24 w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-fg"
          {...form.register('message')}
        />
      </PublicApplyField>
      <label className="flex min-h-11 items-start gap-3 text-sm text-fg">
        <input type="checkbox" className="mt-1 h-5 w-5" {...form.register('consentGiven')} />
        <span>
          {PUBLIC_APPLY_COPY.consentPrefix}{' '}
          <a href={privacyUrl} className="underline" target="_blank" rel="noreferrer">
            {PUBLIC_APPLY_COPY.consentLink}
          </a>
          . {PUBLIC_APPLY_COPY.consentRetention} : {retentionLabel}.
        </span>
      </label>
      {form.formState.errors.consentGiven ? (
        <p className="text-xs text-error">{form.formState.errors.consentGiven.message}</p>
      ) : null}
      {form.formState.errors.root ? (
        <p className="text-xs text-error">{form.formState.errors.root.message}</p>
      ) : null}
      <Button type="submit" variant="accent" className="min-h-11" disabled={submitting}>
        {submitting ? PUBLIC_APPLY_COPY.submitting : PUBLIC_APPLY_COPY.submit}
      </Button>
    </>
  )
}
