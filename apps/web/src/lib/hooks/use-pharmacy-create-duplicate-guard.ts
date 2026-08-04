'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useToastStore } from '@/stores/toast-store'
import { savePharmacyDuplicateDraft } from '@/lib/pharmacy-duplicate-draft-storage'
import { pharmacyDuplicateReviewHref } from '@/lib/pharmacy-import-navigation'
import type { PharmacyInput } from '@/view-models/pharmacy-form.schema'

const PROBE_ERROR = 'Impossible de vérifier les doublons. Réessaie.'

export function usePharmacyCreateDuplicateGuard() {
  const router = useRouter()
  const utils = trpc.useUtils()
  const push = useToastStore((s) => s.push)

  return async function guard(data: PharmacyInput): Promise<boolean> {
    try {
      const matches = await utils.pharmacy.detectDuplicate.fetch({
        siret: data.siret || undefined,
        name: data.name,
        city: data.city || undefined,
        postalCode: data.postalCode || undefined,
      })
      if (!matches.length) return false

      savePharmacyDuplicateDraft({
        mode: 'create',
        incoming: { ...data, status: data.status ?? 'PROSPECT' },
        returnPath: '/pharmacies/new',
        matches,
      })
      if (matches.length > 1) {
        router.push(pharmacyDuplicateReviewHref(undefined, true))
      } else {
        router.push(pharmacyDuplicateReviewHref(matches[0]?.pharmacyId))
      }
      return true
    } catch {
      // Block create — never fall through to Prisma unique toast.
      push({ variant: 'error', message: PROBE_ERROR })
      return true
    }
  }
}
