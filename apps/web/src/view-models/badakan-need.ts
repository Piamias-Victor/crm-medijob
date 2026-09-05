export type StaffingCounts = {
  expectedRecipients: number
  staffedRecipients: number
}

export function isOpenNeed(counts: StaffingCounts): boolean {
  return counts.expectedRecipients > counts.staffedRecipients
}

export function staffingGapLabel(counts: StaffingCounts): string {
  return `${counts.staffedRecipients}/${counts.expectedRecipients} pourvus`
}
