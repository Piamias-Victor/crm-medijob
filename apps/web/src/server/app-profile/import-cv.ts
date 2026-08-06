import { fetchBadakanResume } from '@/server/badakan/fetch-resume'
import { badakanEnvConfig } from '@/server/badakan/client'
import { uploadBlob, type BlobClient } from '@/server/services/blob'

export async function importBadakanCvToBlob(
  badakanId: string,
  client: BlobClient,
): Promise<string | null> {
  const cfg = badakanEnvConfig()
  const file = await fetchBadakanResume({ ...cfg, badakanId })
  if (!file) return null
  const uploaded = await uploadBlob(client, {
    pathname: `candidate/badakan/${badakanId}/${file.filename}`,
    body: file.body,
    contentType: file.contentType,
  })
  return uploaded.url
}
