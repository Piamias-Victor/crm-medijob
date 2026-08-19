export type JobsBoardEnv = {
  url: string
  secret: string
  contactEmail: string
}

export function readJobsBoardEnv(env: NodeJS.ProcessEnv = process.env): JobsBoardEnv {
  return {
    url: env.JOBS_SUPABASE_URL?.trim() ?? '',
    secret: env.JOBS_SUPABASE_SECRET_KEY?.trim() ?? '',
    contactEmail: env.JOBS_CONTACT_EMAIL?.trim() ?? '',
  }
}

export function jobsBoardConfigured(config: JobsBoardEnv) {
  return Boolean(config.url && config.secret && config.contactEmail)
}

export function jobsBoardReadable(config: JobsBoardEnv) {
  return Boolean(config.url && config.secret)
}
