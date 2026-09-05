import { NextResponse } from 'next/server'
import { isCronAuthorized, runApplicationIngest } from '@/server/application/run-ingest'
import { CRON_DISABLED_RESPONSE, isCronEnabled } from '@/server/cron/enabled'

export async function GET(request: Request) {
  if (!isCronAuthorized(request.headers.get('authorization'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!isCronEnabled()) return NextResponse.json(CRON_DISABLED_RESPONSE)
  const result = await runApplicationIngest()
  return NextResponse.json(result)
}
