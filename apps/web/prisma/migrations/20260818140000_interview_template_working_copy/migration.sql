CREATE TABLE "InterviewTemplateWorkingCopy" (
    "id" TEXT NOT NULL,
    "profileKey" TEXT NOT NULL,
    "mode" "InterviewMode" NOT NULL,
    "label" TEXT NOT NULL,
    "sections" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewTemplateWorkingCopy_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "InterviewTemplateWorkingCopy_profileKey_mode_key"
  ON "InterviewTemplateWorkingCopy"("profileKey", "mode");
