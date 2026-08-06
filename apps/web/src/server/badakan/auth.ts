type LoginBody = {
  securityToken?: string
  security_token?: string
  token?: string
}

export async function badakanLogin(
  baseUrl: string,
  email: string,
  password: string,
  fetchFn: typeof fetch = fetch,
): Promise<string> {
  const res = await fetchFn(`${baseUrl}/services/v3/accounts/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error(`Badakan login failed (${res.status})`)
  const body = (await res.json()) as LoginBody
  const token = body.securityToken ?? body.security_token ?? body.token
  if (!token) throw new Error('Badakan login: missing securityToken')
  return token
}

export async function badakanGetRecipient(
  baseUrl: string,
  token: string,
  badakanId: string,
  fetchFn: typeof fetch = fetch,
): Promise<unknown> {
  const res = await fetchFn(`${baseUrl}/services/v3/recipients/${badakanId}`, {
    headers: { security_token: token },
  })
  if (!res.ok) throw new Error(`Badakan recipient failed (${res.status})`)
  return res.json()
}
