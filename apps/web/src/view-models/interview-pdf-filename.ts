export function interviewPdfFilename(interviewId: string) {
  return `CR-entretien-${interviewId}.pdf`
}

export function findInterviewPdfId(
  documents: { id: string; name: string }[],
  interviewId: string,
) {
  const name = interviewPdfFilename(interviewId)
  return documents.find((doc) => doc.name === name)?.id ?? null
}
