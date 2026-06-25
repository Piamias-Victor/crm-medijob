'use client'

import { Alert } from '@/components/atoms/Alert'
import { useContactPrimaryWarning } from '@/lib/hooks/use-contact-primary-warning'

type Props = {
  pharmacyId?: string
  isPrimary: boolean
  excludeContactId?: string
}

export function ContactPrimaryWarningAlert({ pharmacyId, isPrimary, excludeContactId }: Props) {
  const warning = useContactPrimaryWarning(pharmacyId, isPrimary, excludeContactId)
  if (!warning) return null
  return <Alert variant="warning">{warning}</Alert>
}
