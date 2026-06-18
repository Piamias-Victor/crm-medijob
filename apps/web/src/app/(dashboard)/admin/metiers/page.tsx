import { createServerCaller } from '@/lib/trpc/server'
import { JobTitleAdmin } from '@/components/organisms/JobTitleAdmin'

export default async function AdminJobTitlesPage() {
  const caller = await createServerCaller()
  const [titles, compatibilities] = await Promise.all([
    caller.admin.jobTitle.list(),
    caller.admin.jobTitle.compatibilities(),
  ])
  return <JobTitleAdmin titles={titles} compatibilities={compatibilities} />
}
