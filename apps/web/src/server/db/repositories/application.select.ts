export const applicationInboxSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  city: true,
  cvUrl: true,
  message: true,
  createdAt: true,
  jobTitle: { select: { name: true } },
  jobOffer: { select: { title: true } },
} as const

export const applicationDetailSelect = {
  ...applicationInboxSelect,
  status: true,
  boardSubmissionId: true,
  jobTitleId: true,
  candidateId: true,
  jobOffer: { select: { id: true, title: true } },
} as const
