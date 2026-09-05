'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/atoms/Button'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'

type Props = { enterpriseId: string }

export function VerifyEnterpriseButton({ enterpriseId }: Props) {
  const router = useRouter()
  const toast = useEntityMutation({
    successMessage: 'Pharmacy validée',
    onSuccess: () => router.push('/interim/officines'),
  })
  const confirm = trpc.badakanEnterprise.confirm.useMutation({
    onSuccess: toast.onSuccess,
    onError: toast.onError,
  })

  return (
    <Button
      type="button"
      disabled={confirm.isPending}
      onClick={() => confirm.mutate({ id: enterpriseId })}
    >
      Valider Pharmacy
    </Button>
  )
}
