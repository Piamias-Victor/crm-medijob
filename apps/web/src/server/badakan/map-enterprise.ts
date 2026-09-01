import {
  badakanEnterpriseSchema,
  type BadakanEnterpriseRaw,
  type BadakanEnterpriseUser,
} from './map-enterprise.schema'

export type BadakanEnterprisePrincipal = {
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
}

export type BadakanEnterprise = {
  badakanId: string
  name: string
  siret: string | null
  address: string | null
  city: string | null
  postalCode: string | null
  principal: BadakanEnterprisePrincipal | null
}

function present(value: string | null | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

function mapUser(u: BadakanEnterpriseUser): BadakanEnterprisePrincipal {
  return {
    firstName: (u.firstName ?? '').trim() || '—',
    lastName: (u.lastName ?? '').trim() || '—',
    email: present(u.email),
    phone: present(u.validatedPhoneNumber ?? u.phone ?? u.mobilePhone),
  }
}

function pickPrincipal(raw: BadakanEnterpriseRaw): BadakanEnterprisePrincipal | null {
  if (raw.principalUser) return mapUser(raw.principalUser)
  const users = raw.users ?? []
  const hit =
    users.find((u) => u.principal === true || u.isPrincipal === true) ?? users[0]
  return hit ? mapUser(hit) : null
}

function mapAddress(raw: BadakanEnterpriseRaw) {
  if (typeof raw.address === 'string') {
    return {
      address: present(raw.address),
      city: present(raw.city),
      postalCode: present(raw.postalCode ?? raw.zipCode),
    }
  }
  const nested = raw.address
  const line = [nested?.address1, nested?.address2]
    .map((p) => p?.trim())
    .filter(Boolean)
    .join(', ')
  return {
    address: line || null,
    city: present(nested?.city ?? raw.city),
    postalCode: present(nested?.postalCode ?? nested?.zipCode ?? raw.postalCode ?? raw.zipCode),
  }
}

export function mapBadakanEnterprise(raw: unknown): BadakanEnterprise | null {
  const parsed = badakanEnterpriseSchema.safeParse(raw)
  if (!parsed.success) return null
  const r = parsed.data
  const loc = mapAddress(r)
  return {
    badakanId: r.id,
    name: present(r.enterpriseName ?? r.name) ?? '—',
    siret: present(r.siret ?? r.siretNumber),
    address: loc.address,
    city: loc.city,
    postalCode: loc.postalCode,
    principal: pickPrincipal(r),
  }
}
