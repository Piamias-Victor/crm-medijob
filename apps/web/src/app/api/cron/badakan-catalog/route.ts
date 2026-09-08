import { NextResponse } from 'next/server'
import { isCronAuthorized } from '@/server/cron/auth'
import { CRON_DISABLED_RESPONSE, isCronEnabled } from '@/server/cron/enabled'
import { runBadakanCatalogCycle } from '@/server/badakan-catalog/run-cycle'

export const maxDuration = 800

export async function GET(request: Request) {
  if (!isCronAuthorized(request.headers.get('authorization'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!isCronEnabled()) return NextResponse.json(CRON_DISABLED_RESPONSE)
  return NextResponse.json(await runBadakanCatalogCycle())
}
