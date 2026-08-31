import { notFound } from 'next/navigation'
import { createServerCaller } from '@/lib/trpc/server'
import { WeeklyAvailabilityPage } from '@/components/organisms/WeeklyAvailabilityPage'
import { weeklyAvailabilityTokenSchema } from '@/view-models/weekly-availability.schema'

export const metadata = { title: 'Disponibilités — MediJob' }

type Props = {
  params: Promise<{ token: string }>
  searchParams: Promise<{ week?: string }>
}

export default async function Page({ params, searchParams }: Props) {
  const { token } = await params
  const parsed = weeklyAvailabilityTokenSchema.safeParse(token)
  if (!parsed.success) notFound()
  const { week } = await searchParams
  const weekStart = week && /^\d{4}-\d{2}-\d{2}$/.test(week) ? week : undefined
  const caller = await createServerCaller()
  const result = await caller.weeklyAvailability.getWeek({ token: parsed.data, weekStart })
  if (!result) notFound()
  return (
    <WeeklyAvailabilityPage
      key={result.weekStart}
      token={parsed.data}
      weekStart={result.weekStart}
      slots={result.slots}
    />
  )
}
