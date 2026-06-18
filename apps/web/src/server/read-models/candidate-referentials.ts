type Ref = { id: string; name: string }
type Stage = Ref & { position: number }

export type CandidateReferentialsReader = {
  listJobTitles: () => Promise<Ref[]>
  listSoftwares: () => Promise<Ref[]>
  listRecruiters: () => Promise<Ref[]>
  listPipelineStages: () => Promise<Stage[]>
}

export async function loadCandidateReferentials(reader: CandidateReferentialsReader) {
  const [jobTitles, softwares, recruiters, pipelineStages] = await Promise.all([
    reader.listJobTitles(),
    reader.listSoftwares(),
    reader.listRecruiters(),
    reader.listPipelineStages(),
  ])
  return { jobTitles, softwares, recruiters, pipelineStages }
}
