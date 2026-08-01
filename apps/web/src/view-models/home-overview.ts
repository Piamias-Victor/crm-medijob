export type DashboardAlertItem = {
  id: string
  label: string
  href: string
}

export type DashboardAlertBucket = {
  count: number
  items: DashboardAlertItem[]
}

export type DashboardAlerts = {
  uncoveredMissions: DashboardAlertBucket
  untreatedApplications: DashboardAlertBucket
  overdueFollowUps: DashboardAlertBucket
}

export type DashboardOverview = {
  candidates: number
  pharmacies: number
  missionsActive: number
  inboxPending: number
  missionsUrgent: number
  fillRate: number
  alerts: DashboardAlerts
}
