'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from '@/lib/trpc/client'
import {
  publicApplyFormSchema,
  type PublicApplyFormValues,
} from '@/view-models/public-apply.schema'
import { PublicApplyIdentityFields } from '@/components/molecules/PublicApplyIdentityFields'
import { PublicApplyCvConsent } from '@/components/molecules/PublicApplyCvConsent'
import { usePublicApplyCv } from '@/components/molecules/use-public-apply-cv'

type Props = {
  boardListingId: string
  privacyUrl: string
  retentionLabel: string
  onSuccess: () => void
}

export function PublicApplyForm(props: Props) {
  const submit = trpc.publicApply.submit.useMutation()
  const cv = usePublicApplyCv()
  const form = useForm<PublicApplyFormValues>({
    resolver: zodResolver(publicApplyFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      city: '',
      postalCode: '',
      message: '',
      consentGiven: false,
      hpConfirm: '',
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    if (!cv.ensureReady()) return
    try {
      await submit.mutateAsync({
        ...values,
        boardListingId: props.boardListingId,
        cvFilename: cv.file!.name,
        cvBase64: cv.file!.base64,
      })
      props.onSuccess()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Envoi impossible'
      form.setError('root', { message })
    }
  })

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        {...form.register('hpConfirm')}
      />
      <PublicApplyIdentityFields form={form} />
      <PublicApplyCvConsent form={form} cv={cv} {...props} submitting={submit.isPending} />
    </form>
  )
}
