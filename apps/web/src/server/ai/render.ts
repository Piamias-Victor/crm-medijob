import type {
  ResponseKind,
  ChatResponse,
  SummaryResponse,
  EmailResponse,
  OfferResponse,
  ReportResponse,
} from './schemas'

export function renderResponse(kind: ResponseKind, data: unknown): string {
  switch (kind) {
    case 'chat':
      return (data as ChatResponse).reply
    case 'summary':
      return (data as SummaryResponse).summary
    case 'email': {
      const email = data as EmailResponse
      return `Objet : ${email.subject}\n\n${email.body}`
    }
    case 'offer': {
      const offer = data as OfferResponse
      return `# ${offer.title}\n\n${offer.content}`
    }
    case 'report':
      return (data as ReportResponse).report
  }
}
