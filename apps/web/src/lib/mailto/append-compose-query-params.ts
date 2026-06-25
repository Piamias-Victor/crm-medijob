type ComposeQueryParams = {
  cc?: string
  bcc?: string
  subject?: string
  body?: string
  subjectKey?: 'subject' | 'su'
}

export function appendComposeQueryParams(params: URLSearchParams, input: ComposeQueryParams) {
  const subjectKey = input.subjectKey ?? 'subject'
  if (input.cc) params.set('cc', input.cc)
  if (input.bcc) params.set('bcc', input.bcc)
  if (input.subject) params.set(subjectKey, input.subject)
  if (input.body) params.set('body', input.body)
}
