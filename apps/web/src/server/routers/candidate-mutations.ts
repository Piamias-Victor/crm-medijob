import { protectedProcedure } from '@/server/trpc'
import {
  candidateCreateInputSchema,
  updateCandidateSchema,
} from '@/view-models/candidate-profile.schema'
import { toCandidateCreateData, toCandidateUpdateData } from '@/view-models/candidate-profile-map'
import { resolveGeocodeForWrite } from '@/lib/geo/resolve-geocode-for-write'
import type { AddressFields } from '@/lib/geo/geocode-address-fields'
import type { CandidateDeps } from '@/server/routers/candidate.deps'
import type { CandidateProfileUpdate } from '@/view-models/candidate-profile-update'

function asAddress(data: {
  address?: string | null
  city?: string | null
  postalCode?: string | null
}): AddressFields {
  return {
    address: data.address ?? null,
    city: data.city ?? null,
    postalCode: data.postalCode ?? null,
  }
}

async function withGeocode(
  data: CandidateProfileUpdate,
  previous: AddressFields | null,
  existingCoords: { latitude: number | null; longitude: number | null } | null,
  lookup: CandidateDeps['lookupQuery'],
): Promise<CandidateProfileUpdate> {
  const geo = await resolveGeocodeForWrite(asAddress(data), previous, lookup)
  if (geo === undefined) {
    return {
      ...data,
      latitude: existingCoords?.latitude ?? null,
      longitude: existingCoords?.longitude ?? null,
    }
  }
  return { ...data, ...geo }
}

export function candidateCreateMutation(deps: CandidateDeps) {
  return protectedProcedure.input(candidateCreateInputSchema).mutation(async ({ ctx, input }) => {
    const data = await withGeocode(toCandidateCreateData(input), null, null, deps.lookupQuery)
    const row = await deps.createProfile(data)
    await deps.logLifecycle({
      action: 'created',
      entityType: 'CANDIDATE',
      entityId: row.id,
      user: ctx.session.user,
    })
    return row
  })
}

export function candidateUpdateMutation(deps: CandidateDeps) {
  return protectedProcedure.input(updateCandidateSchema).mutation(async ({ ctx, input }) => {
    const previous = await deps.findProfileById(input.id)
    const data = await withGeocode(
      toCandidateUpdateData(input.data),
      previous ? asAddress(previous) : null,
      previous
        ? { latitude: previous.latitude ?? null, longitude: previous.longitude ?? null }
        : null,
      deps.lookupQuery,
    )
    const row = await deps.updateProfile(input.id, data)
    await deps.logLifecycle({
      action: 'updated',
      entityType: 'CANDIDATE',
      entityId: input.id,
      user: ctx.session.user,
    })
    return row
  })
}
