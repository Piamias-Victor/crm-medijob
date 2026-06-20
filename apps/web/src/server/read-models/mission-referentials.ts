export type MissionReferentialsReader = {
  listJobTitles: () => Promise<{ id: string; name: string }[]>
  listRecruiters: () => Promise<{ id: string; name: string }[]>
  listPharmacies: () => Promise<{ id: string; name: string }[]>
}

export async function loadMissionReferentials(reader: MissionReferentialsReader) {
  const [jobTitles, recruiters, pharmacies] = await Promise.all([
    reader.listJobTitles(),
    reader.listRecruiters(),
    reader.listPharmacies(),
  ])
  return { jobTitles, recruiters, pharmacies }
}
