import { createServerCaller } from '@/lib/trpc/server'
import { JobTitleAdmin } from '@/components/organisms/JobTitleAdmin'

export default async function AdminJobTitlesPage() {
  const caller = await createServerCaller()
  const [titles, compatibilities, pairs, published] = await Promise.all([
    caller.admin.jobTitle.list(),
    caller.admin.jobTitle.compatibilities(),
    caller.admin.interviewTemplate.listPairs(),
    caller.admin.interviewTemplate.list(),
  ])
  return (
    <JobTitleAdmin
      titles={titles}
      compatibilities={compatibilities}
      pairs={pairs}
      published={published}
    />
  )
}
