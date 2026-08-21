import { notFound, redirect } from 'next/navigation'
import { auth } from '@/server/auth'
import { createServerCaller } from '@/lib/trpc/server'
import { ApplicationDetailPage } from '@/components/organisms/application-detail-page/ApplicationDetailPage'
import { buildInboxAcceptDefaults } from '@/view-models/inbox-accept-defaults'

type Props = { params: Promise<{ id: string }> }

export default async function Page({ params }: Props) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const { id } = await params
  const caller = await createServerCaller()
  const [application, referentials] = await Promise.all([
    caller.application.getById({ id }),
    caller.candidate.referentials(),
  ])
  if (!application) notFound()

  const fallbackJobTitleId = referentials.jobTitles[0]?.id
  if (!fallbackJobTitleId) redirect('/candidats?tab=inbox')

  return (
    <ApplicationDetailPage
      application={application}
      defaults={buildInboxAcceptDefaults({
        firstName: application.firstName,
        lastName: application.lastName,
        email: application.email,
        phone: application.phone,
        city: application.city,
        jobTitleId: application.jobTitleId,
        referentId: session.user.id,
        fallbackJobTitleId,
      })}
    />
  )
}
