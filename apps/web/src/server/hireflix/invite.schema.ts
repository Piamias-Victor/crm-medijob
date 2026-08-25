import { z } from 'zod'

export const hireflixInterviewOkSchema = z.object({
  __typename: z.literal('InterviewType'),
  id: z.string().min(1),
  url: z.object({ public: z.string().url() }),
})

const alreadyExistsSchema = z.object({
  __typename: z.literal('InterviewAlreadyExistsInPositionError'),
  code: z.union([z.string(), z.number()]).optional(),
  message: z.string().optional(),
})

const exceededInvitesSchema = z.object({
  __typename: z.literal('ExceededInvitesThisPeriodError'),
  code: z.union([z.string(), z.number()]).optional(),
  message: z.string().optional(),
})

export const hireflixInviteDataSchema = z.object({
  data: z.object({
    inviteCandidateToInterview: z.discriminatedUnion('__typename', [
      hireflixInterviewOkSchema,
      alreadyExistsSchema,
      exceededInvitesSchema,
    ]),
  }),
})

export const hireflixExistingSchema = z.object({
  data: z.object({
    position: z.object({
      interviewList: z.object({
        results: z
          .array(
            z.object({
              id: z.string().min(1),
              url: z.object({ public: z.string().url() }),
            }),
          )
          .min(1),
      }),
    }),
  }),
})
