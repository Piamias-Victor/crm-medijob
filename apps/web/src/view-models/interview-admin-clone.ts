import type { InterviewAdminSection } from '@/view-models/interview-admin-sections'

export function cloneAdminSections(sections: InterviewAdminSection[]): InterviewAdminSection[] {
  return sections.map((section) => ({
    ...section,
    id: crypto.randomUUID(),
    questions: section.questions.map((question) => ({
      ...question,
      id: crypto.randomUUID(),
    })),
  }))
}
