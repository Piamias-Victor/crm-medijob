'use client'

import {
  confirmSponsorshipTransfer,
  isTransferRequiredError,
} from '@/view-models/sponsorship-confirm'
import type { useSponsorship } from '@/lib/hooks/use-sponsorship'

type Api = ReturnType<typeof useSponsorship>

export function useSponsorshipActions(api: Api, entityId: string) {
  const setMarraine = async (sponsorId: string, confirmTransfer = false) => {
    try {
      await api.link.mutateAsync({
        filleuleId: entityId,
        sponsorId,
        confirmTransfer,
      })
    } catch (error) {
      if (!confirmTransfer && isTransferRequiredError(error) && confirmSponsorshipTransfer()) {
        await setMarraine(sponsorId, true)
      } else {
        throw error
      }
    }
  }

  const addFilleule = async (filleuleId: string, confirmTransfer = false) => {
    try {
      await api.link.mutateAsync({
        filleuleId,
        sponsorId: entityId,
        confirmTransfer,
      })
    } catch (error) {
      if (!confirmTransfer && isTransferRequiredError(error) && confirmSponsorshipTransfer()) {
        await addFilleule(filleuleId, true)
      } else {
        throw error
      }
    }
  }

  return {
    setMarraine,
    addFilleule,
    clearMarraine: () => api.unlink.mutateAsync({ filleuleId: entityId }),
    removeFilleule: (filleuleId: string) => api.unlink.mutateAsync({ filleuleId }),
  }
}
