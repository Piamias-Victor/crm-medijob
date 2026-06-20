export type HomeRef = { id: string; name: string }

export type HomeReferentials = {
  jobTitles: HomeRef[]
  recruiters: HomeRef[]
  pharmacies: HomeRef[]
  groupements: HomeRef[]
  softwares: HomeRef[]
}

export type HomeQuickCreateKind = 'candidate' | 'mission' | 'pharmacy' | 'contact'
