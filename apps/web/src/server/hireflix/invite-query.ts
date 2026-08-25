export const HIREFLIX_INVITE_MUTATION = `
mutation InviteCandidate($input: InviteCandidateToInterviewInput!) {
  inviteCandidateToInterview(input: $input) {
    __typename
    ... on InterviewType {
      id
      url { public }
    }
    ... on InterviewAlreadyExistsInPositionError { code message }
    ... on ExceededInvitesThisPeriodError { code message }
  }
}
`.trim()

export const HIREFLIX_EXISTING_QUERY = `
query ExistingInterview($positionId: String!, $email: String!) {
  position(id: $positionId) {
    interviewList(input: {
      filter: { email: { regex: $email } }
      pagination: { limit: 1, direction: FORWARD }
      sort: [{ field: createdAt, direction: DESC }]
    }) {
      results { id url { public } }
    }
  }
}
`.trim()
