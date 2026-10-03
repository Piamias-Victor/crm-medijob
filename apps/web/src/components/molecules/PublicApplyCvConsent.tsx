'use client'

import type { UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/atoms/Button'
import { PublicApplyField } from '@/components/molecules/PublicApplyField'
import { PublicApplyCvDropzone } from '@/components/molecules/PublicApplyCvDropzone'
import type { usePublicApplyCv } from '@/components/molecules/use-public-apply-cv'
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
  const consentError = form.formState.errors.consentGiven?.message
  return (
    <>
      <PublicApplyCvDropzone cv={cv} />
      <PublicApplyField label={PUBLIC_APPLY_COPY.fields.message}>
        <textarea
          className="min-h-24 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-fg"
          {...form.register('message')}
        />
      </PublicApplyField>
      <label className="flex min-h-14 cursor-pointer items-start gap-3 rounded-2xl border-2 border-[var(--color-primary)] bg-white p-4 text-sm text-fg">
        <input
          type="checkbox"
          className="mt-0.5 size-6 shrink-0 rounded accent-[var(--color-accent)]"
          {...form.register('consentGiven')}
        />
        <span>
          {PUBLIC_APPLY_COPY.consentPrefix}
          <a href={privacyUrl} className="font-semibold underline" target="_blank" rel="noreferrer">
            {PUBLIC_APPLY_COPY.consentLink}
          </a>
          {PUBLIC_APPLY_COPY.consentRetention} {retentionLabel}.
        </span>
      </label>
      {consentError ? <p className="text-xs text-error">{consentError}</p> : null}
      {form.formState.errors.root ? (
        <p className="text-xs text-error">{form.formState.errors.root.message}</p>
      ) : null}
      <Button
        type="submit"
        variant="accent"
        className="min-h-12 rounded-xl text-base font-semibold shadow-md"
        disabled={submitting}
      >
        {submitting ? PUBLIC_APPLY_COPY.submitting : PUBLIC_APPLY_COPY.submit}
      </Button>
    </>
  )
}
