import {
  resolveJobTitleId,
  resolveSoftwareId,
  type ReferentialEntry,
} from '@/server/badakan/resolve-referential'

export type MissionReferentialInput = {
  activityLabel: string | null
  softwareLabel: string | null
}

export type MissionReferentialIds = {
  jobTitleId: string | null
  softwareId: string | null
}

export type MissionReferentialDeps = {
  listJobTitles: () => Promise<ReferentialEntry[]>
  listSoftwares: () => Promise<ReferentialEntry[]>
  askJobTitle?: (label: string, jobTitles: ReferentialEntry[]) => Promise<string | null>
}

export function makeMissionReferentialResolver(deps: MissionReferentialDeps) {
  let referentials: { jobTitles: ReferentialEntry[]; softwares: ReferentialEntry[] } | null = null
  const askedLabels = new Map<string, string | null>()

  const load = async () => {
    if (!referentials) {
      const [jobTitles, softwares] = await Promise.all([deps.listJobTitles(), deps.listSoftwares()])
      referentials = { jobTitles, softwares }
    }
    return referentials
  }

  const askOnce = async (label: string, jobTitles: ReferentialEntry[]) => {
    if (!deps.askJobTitle) return null
    if (askedLabels.has(label)) return askedLabels.get(label) ?? null
    const answer = await deps.askJobTitle(label, jobTitles)
    const known = jobTitles.some((jobTitle) => jobTitle.id === answer) ? answer : null
    askedLabels.set(label, known)
    return known
  }

  return async (mission: MissionReferentialInput): Promise<MissionReferentialIds> => {
    const { jobTitles, softwares } = await load()
    const matched = resolveJobTitleId(mission.activityLabel, jobTitles)
    return {
      jobTitleId:
        matched ?? (mission.activityLabel ? await askOnce(mission.activityLabel, jobTitles) : null),
      softwareId: resolveSoftwareId(mission.softwareLabel, softwares),
    }
  }
}
