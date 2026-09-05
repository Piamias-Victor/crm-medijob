export const proposalCandidateInclude = {
  candidate: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      city: true,
      jobTitle: { select: { name: true } },
    },
  },
} as const
