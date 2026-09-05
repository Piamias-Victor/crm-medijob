import type { BadakanProposalStatus } from '@prisma/client'

export function trackingStepFromProposals(
  step: string,
  statuses: BadakanProposalStatus[],
): string {
  if (statuses.includes('VALIDE') || step === 'STAFFED') return 'STAFFED'
  if (statuses.includes('PROPOSE')) return 'PROPOSE'
  return step
}
