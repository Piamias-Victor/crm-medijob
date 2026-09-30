export type ActiviteCounts = {
  candidatesCrm: number
  candidatesApp: number
  appValidated: number
  qualifies: number
  applications: number
  missionsCreated: number
  missionsFilled: number
  badakanCreated: number
  badakanStaffed: number
}

export type ActiviteSeriesPoint = {
  label: string
  candidatesCrm: number
  candidatesApp: number
  appValidated: number
  qualifies: number
  applications: number
  missionsCreated: number
  missionsFilled: number
  badakanCreated: number
  badakanStaffed: number
}

export type ActiviteOverview = {
  fromYmd: string
  toYmd: string
  counts: ActiviteCounts
  entrants: ActiviteSeriesPoint[]
  missions: ActiviteSeriesPoint[]
}
