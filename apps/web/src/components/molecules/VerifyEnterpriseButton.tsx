'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/atoms/Button'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'

type Props = { enterpriseId: string; siret: string; label: string }

export function VerifyEnterpriseButton({ enterpriseId, siret, label }: Props) {
  const router = useRouter()
  const toast = useEntityMutation({
    successMessage: 'Pharmacie enregistrée',
    onSuccess: () => router.push('/interim/officines'),
  })
  const confirm = trpc.badakanEnterprise.confirm.useMutation({
    onSuccess: toast.onSuccess,
    onError: toast.onError,
  })
  const ready = siret.trim().length > 0

  return (
    <Button
      type="button"
      disabled={!ready || confirm.isPending}
      onClick={() => confirm.mutate({ id: enterpriseId, siret })}
    >
      {label}
    </Button>
  )
}
