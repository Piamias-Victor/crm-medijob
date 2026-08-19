import { NextResponse } from 'next/server'
import { isCronAuthorized, runApplicationIngest } from '@/server/application/run-ingest'

export async function GET(request: Request) {
  if (!isCronAuthorized(request.headers.get('authorization'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const result = await runApplicationIngest()
  return NextResponse.json(result)
}
