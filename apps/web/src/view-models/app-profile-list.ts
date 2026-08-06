export type AppProfileListItem = {
  id: string
  badakanId: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  postalCode: string | null
  activityLabel: string | null
  jobTitleId: string | null
  jobTitleName: string | null
  hasResume: boolean
  syncedAt: Date
}

export function toAppProfileListItem(row: {
  id: string
  badakanId: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  postalCode: string | null
  activityLabel: string | null
  jobTitleId: string | null
  hasResume: boolean
  syncedAt: Date
  jobTitle: { id: string; name: string } | null
}): AppProfileListItem {
  return {
    id: row.id,
    badakanId: row.badakanId,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    phone: row.phone,
    address: row.address,
    city: row.city,
    postalCode: row.postalCode,
    activityLabel: row.activityLabel,
    jobTitleId: row.jobTitleId,
    jobTitleName: row.jobTitle?.name ?? null,
    hasResume: row.hasResume,
    syncedAt: row.syncedAt,
  }
}
