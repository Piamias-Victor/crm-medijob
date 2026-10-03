import { createServerCaller } from '@/lib/trpc/server'
import { PublicApplyPage } from '@/components/organisms/PublicApplyPage'

export const metadata = {
  title: 'Candidature spontanée — MediJob',
  robots: { index: false, follow: false },
}

export default async function Page() {
  const caller = await createServerCaller()
  const privacy = await caller.publicApply.privacy()
  return (
    <PublicApplyPage privacyUrl={privacy.privacyUrl} retentionLabel={privacy.retentionLabel} />
  )
}
