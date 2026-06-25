'use client'

import { useEffect } from 'react'
import { trpc } from '@/lib/trpc/client'
import { useToastStore } from '@/stores/toast-store'
import {
  CONTACT_PRIMARY_PROBE_ERROR,
  resolveContactPrimaryMessage,
} from '@/view-models/contact-primary-warning'

export function useContactPrimaryWarning(
  pharmacyId: string | undefined,
  isPrimary: boolean,
  excludeContactId?: string,
) {
  const push = useToastStore((s) => s.push)
  const query = trpc.contact.primaryByPharmacy.useQuery(
    { pharmacyId: pharmacyId ?? '', excludeContactId },
    { enabled: Boolean(pharmacyId) },
  )

  useEffect(() => {
    if (query.isError) push({ variant: 'error', message: CONTACT_PRIMARY_PROBE_ERROR })
  }, [query.isError, push])

  return query.data?.fullName ? resolveContactPrimaryMessage(query.data.fullName, isPrimary) : null
}
