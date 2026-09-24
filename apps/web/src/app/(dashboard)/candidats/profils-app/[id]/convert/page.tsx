import { redirect } from 'next/navigation'
import { ENTREES_APP_HREF } from '@/view-models/candidats-tab'

export default function Page() {
  redirect(ENTREES_APP_HREF)
}
