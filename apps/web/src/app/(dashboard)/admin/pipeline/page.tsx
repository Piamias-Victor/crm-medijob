import { createServerCaller } from '@/lib/trpc/server'
import { PipelineAdmin } from '@/components/organisms/PipelineAdmin'

export default async function AdminPipelinePage() {
  const caller = await createServerCaller()
  const items = await caller.admin.pipeline.list()
  return <PipelineAdmin items={items} />
}
