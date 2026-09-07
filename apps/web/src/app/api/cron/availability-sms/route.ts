import { NextResponse } from 'next/server'
import { isCronAuthorized } from '@/server/cron/auth'
import { runAvailabilitySmsCron } from '@/server/cron/availability-sms'

export const maxDuration = 300

export async function GET(request: Request) {
  if (!isCronAuthorized(request.headers.get('authorization'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json(await runAvailabilitySmsCron())
}
