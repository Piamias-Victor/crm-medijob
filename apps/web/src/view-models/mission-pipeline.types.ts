export type PipelineStageRef = { id: string; name: string; position: number }

export type PipelineCandidateRow = {
  candidateId: string
  fullName: string
  stageId: string
  stageName: string
  jobTitle: string | null
  city: string | null
  postalCode: string | null
  referentName: string | null
}

export type MissionPipelineColumn = {
  stage: PipelineStageRef
  cards: PipelineCandidateRow[]
}
