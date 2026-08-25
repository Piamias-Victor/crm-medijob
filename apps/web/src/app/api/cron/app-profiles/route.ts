import { NextResponse } from 'next/server'
import { isCronAuthorized } from '@/server/cron/auth'
import { runAppProfileCycle } from '@/server/app-profile/run-cycle'

export const maxDuration = 300

export async function GET(request: Request) {
  if (!isCronAuthorized(request.headers.get('authorization'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const result = await runAppProfileCycle()
  return NextResponse.json(result)
}
