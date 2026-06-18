export type MissionReferentialsReader = {
  listJobTitles: () => Promise<{ id: string; name: string }[]>
  listRecruiters: () => Promise<{ id: string; name: string }[]>
}

export async function loadMissionReferentials(reader: MissionReferentialsReader) {
  const [jobTitles, recruiters] = await Promise.all([
    reader.listJobTitles(),
    reader.listRecruiters(),
  ])
  return { jobTitles, recruiters }
}
