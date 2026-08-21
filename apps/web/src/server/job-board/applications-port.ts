export type BoardApplication = {
  id: string
  offre_id: string | null
  prenom: string
  nom: string
  email: string
  telephone?: string | null
  ville?: string | null
  cv_url?: string | null
  message?: string | null
  created_at?: string
}

export type JobBoardApplicationsPort = {
  listSubmissions: () => Promise<BoardApplication[]>
}
