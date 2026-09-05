import { createBadakanClient } from './client'

export function testBadakanClient(fetchFn: unknown) {
  return createBadakanClient({
    baseUrl: 'https://api.example/brother-web',
    email: 'u@x.com',
    password: 'secret',
    fetchFn: fetchFn as typeof fetch,
  })
}
