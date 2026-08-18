import { redirect } from 'next/navigation'

type Props = { params: Promise<{ profileKey: string; mode: string }> }

export default async function AdminTramesEditorRedirect({ params }: Props) {
  const { profileKey, mode } = await params
  redirect(`/admin/metiers/${profileKey}/${mode}`)
}
