ALTER TABLE "Interview" ADD COLUMN "templateId" TEXT;

CREATE INDEX "Interview_templateId_idx" ON "Interview"("templateId");

ALTER TABLE "Interview" ADD CONSTRAINT "Interview_templateId_fkey"
  FOREIGN KEY ("templateId") REFERENCES "InterviewTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
