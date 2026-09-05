import { notFound } from 'next/navigation'
import { createServerCaller } from '@/lib/trpc/server'
import { MonthlyAvailabilityPage } from '@/components/organisms/MonthlyAvailabilityPage'
import { weeklyAvailabilityTokenSchema } from '@/view-models/weekly-availability.schema'

export const metadata = { title: 'Disponibilités — MediJob' }

type Props = {
  params: Promise<{ token: string }>
  searchParams: Promise<{ month?: string }>
}

export default async function Page({ params, searchParams }: Props) {
  const { token } = await params
  const parsed = weeklyAvailabilityTokenSchema.safeParse(token)
  if (!parsed.success) notFound()
  const { month: raw } = await searchParams
  const month = raw && /^\d{4}-\d{2}$/.test(raw) ? raw : undefined
  const caller = await createServerCaller()
  const result = await caller.weeklyAvailability.getMonth({ token: parsed.data, month })
  if (!result) notFound()
  return (
    <MonthlyAvailabilityPage
      key={result.month}
      token={parsed.data}
      month={result.month}
      slots={result.slots}
    />
  )
}
