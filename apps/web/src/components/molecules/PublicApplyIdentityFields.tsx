'use client'

import type { UseFormReturn } from 'react-hook-form'
import { PublicApplyTextInput } from '@/components/molecules/PublicApplyField'
import { PUBLIC_APPLY_COPY } from '@/view-models/public-apply-copy'
import type { PublicApplyFormValues } from '@/view-models/public-apply.schema'

export function PublicApplyIdentityFields({
  form,
}: {
  form: UseFormReturn<PublicApplyFormValues>
}) {
  const err = form.formState.errors
  return (
    <>
      <PublicApplyTextInput
        label={PUBLIC_APPLY_COPY.fields.firstName}
        error={err.firstName?.message}
        {...form.register('firstName')}
        autoComplete="given-name"
      />
      <PublicApplyTextInput
        label={PUBLIC_APPLY_COPY.fields.lastName}
        error={err.lastName?.message}
        {...form.register('lastName')}
        autoComplete="family-name"
      />
      <PublicApplyTextInput
        label={PUBLIC_APPLY_COPY.fields.email}
        error={err.email?.message}
        type="email"
        {...form.register('email')}
        autoComplete="email"
      />
      <PublicApplyTextInput
        label={PUBLIC_APPLY_COPY.fields.phone}
        error={err.phone?.message}
        type="tel"
        {...form.register('phone')}
        autoComplete="tel"
      />
      <PublicApplyTextInput
        label={PUBLIC_APPLY_COPY.fields.city}
        error={err.city?.message}
        {...form.register('city')}
        autoComplete="address-level2"
      />
      <PublicApplyTextInput
        label={PUBLIC_APPLY_COPY.fields.postalCode}
        error={err.postalCode?.message}
        inputMode="numeric"
        maxLength={5}
        {...form.register('postalCode')}
        autoComplete="postal-code"
      />
    </>
  )
}
