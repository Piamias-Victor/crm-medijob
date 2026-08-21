export type JobsBoardConfig = { url: string; secret: string }

export function boardRestUrl(config: JobsBoardConfig, path: string) {
  return `${config.url.replace(/\/$/, '')}/rest/v1/${path}`
}

export function boardRestHeaders(secret: string): Record<string, string> {
  return {
    apikey: secret,
    Authorization: `Bearer ${secret}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  }
}

export async function throwBoardError(res: Response): Promise<never> {
  throw new Error(`Job board ${res.status}: ${await res.text()}`)
}
