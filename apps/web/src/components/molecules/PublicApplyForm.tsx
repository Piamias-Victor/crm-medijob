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
  boardListingId?: string
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
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    if (!cv.ensureReady()) return
    try {
      const result = await submit.mutateAsync({
        ...values,
        ...(props.boardListingId ? { boardListingId: props.boardListingId } : {}),
        cvFilename: cv.file!.name,
        cvBase64: cv.file!.base64,
      })
      if (!result.applicationId) {
        form.setError('root', { message: 'Envoi impossible. Réessayez.' })
        return
      }
      props.onSuccess()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Envoi impossible'
      form.setError('root', { message })
    }
  })

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
      <PublicApplyIdentityFields form={form} />
      <PublicApplyCvConsent form={form} cv={cv} {...props} submitting={submit.isPending} />
    </form>
  )
}
