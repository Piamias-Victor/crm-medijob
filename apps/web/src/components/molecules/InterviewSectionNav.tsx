import { INTERVIEW_CHECKLIST_TITLE } from '@/view-models/interview-copy'

type Section = { id: string; title: string }

type Props = { sections: Section[] }

export function InterviewSectionNav({ sections }: Props) {
  return (
    <nav className="sticky top-0 z-10 flex flex-wrap gap-x-3 gap-y-1 border-b border-border bg-white/90 py-2 backdrop-blur">
      {sections.map((section) => (
        <a key={section.id} href={`#${section.id}`} className="text-sm text-accent hover:underline">
          {section.title}
        </a>
      ))}
      <a href="#dossier" className="text-sm text-accent hover:underline">
        {INTERVIEW_CHECKLIST_TITLE}
      </a>
    </nav>
  )
}
