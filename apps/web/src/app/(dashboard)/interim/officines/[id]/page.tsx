import { notFound } from 'next/navigation'
import { createServerCaller } from '@/lib/trpc/server'
import { BadakanEnterpriseVerifyPage } from '@/components/organisms/badakan-enterprise-verify-page/BadakanEnterpriseVerifyPage'

type Props = { params: Promise<{ id: string }> }

export default async function Page({ params }: Props) {
  const { id } = await params
  const caller = await createServerCaller()
  const preview = await caller.badakanEnterprise.getPreview({ id })
  if (!preview) notFound()
  return <BadakanEnterpriseVerifyPage preview={preview} />
}
