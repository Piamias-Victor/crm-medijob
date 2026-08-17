import { AuthError } from 'next-auth'
import { NextResponse } from 'next/server'
import { signIn } from '@/server/auth'
import { HOME_PATH, LOGIN_PATH } from '@/server/auth/access'
import { devTesterCredentials, isDevAutoLogin } from '@/server/auth/dev-auto-login'

export async function GET(request: Request) {
  if (!isDevAutoLogin()) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url))
  }
  const { email, password } = devTesterCredentials()
  try {
    await signIn('credentials', { email, password, redirectTo: HOME_PATH })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.redirect(new URL(`${LOGIN_PATH}?error=dev-auto-login`, request.url))
    }
    throw error
  }
}
