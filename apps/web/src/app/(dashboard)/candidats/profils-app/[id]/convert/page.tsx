import { redirect } from 'next/navigation'
import { auth } from '@/server/auth'
import { createServerCaller } from '@/lib/trpc/server'
import { AppProfileConvertPage } from '@/components/organisms/app-profile-convert-page/AppProfileConvertPage'
import { buildInboxAcceptDefaults } from '@/view-models/inbox-accept-defaults'

type Props = { params: Promise<{ id: string }> }

export default async function Page({ params }: Props) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const { id } = await params
  const caller = await createServerCaller()
  const [profile, referentials] = await Promise.all([
    caller.appProfile.getById({ id }),
    caller.candidate.referentials(),
  ])
  if (profile.status !== 'EN_ATTENTE') redirect(`/candidats/profils-app/${id}`)

  const fallbackJobTitleId = referentials.jobTitles[0]?.id
  if (!fallbackJobTitleId) redirect('/candidats?tab=app-profiles')

  return (
    <AppProfileConvertPage
      profile={profile}
      referentials={referentials}
      defaultValues={buildInboxAcceptDefaults({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        city: profile.city,
        postalCode: profile.postalCode,
        address: profile.address,
        jobTitleId: profile.jobTitleId,
        referentId: session.user.id,
        fallbackJobTitleId,
      })}
    />
  )
}
