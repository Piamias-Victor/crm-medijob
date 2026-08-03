import { protectedProcedure } from '@/server/trpc'
import { toPharmacyUpdateData } from '@/view-models/pharmacy-update'
import {
  pharmacyInputSchema,
  updatePharmacySchema,
} from '@/view-models/pharmacy-form.schema'
import { resolveGeocodeForWrite } from '@/lib/geo/resolve-geocode-for-write'
import type { PharmacyDeps } from '@/server/routers/pharmacy.deps'
import type { AddressFields } from '@/lib/geo/geocode-address-fields'

function asAddress(data: AddressFields): AddressFields {
  return {
    address: data.address ?? null,
    city: data.city ?? null,
    postalCode: data.postalCode ?? null,
  }
}

export function pharmacyCreateMutation(deps: PharmacyDeps) {
  return protectedProcedure.input(pharmacyInputSchema).mutation(async ({ ctx, input }) => {
    const data = toPharmacyUpdateData(input)
    const geo = await resolveGeocodeForWrite(asAddress(data), null, deps.lookupGeo)
    const row = await deps.pharmacies.create({ ...data, ...geo })
    await deps.logLifecycle({
      action: 'created',
      entityType: 'PHARMACY',
      entityId: row.id,
      user: ctx.session.user,
    })
    return row
  })
}

export function pharmacyUpdateMutation(deps: PharmacyDeps) {
  return protectedProcedure.input(updatePharmacySchema).mutation(async ({ ctx, input }) => {
    const data = toPharmacyUpdateData(input.data)
    const previous = await deps.pharmacies.findAddressById(input.id)
    const geo = await resolveGeocodeForWrite(asAddress(data), previous, deps.lookupGeo)
    const patch = geo === undefined ? data : { ...data, ...geo }
    const row = await deps.pharmacies.update(input.id, patch)
    await deps.logLifecycle({
      action: 'updated',
      entityType: 'PHARMACY',
      entityId: input.id,
      user: ctx.session.user,
    })
    return row
  })
}
