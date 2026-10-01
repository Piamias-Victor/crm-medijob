-- AlterTable
ALTER TABLE "JobOffer" ALTER COLUMN "missionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "JobOffer" ADD COLUMN "jobTitleId" TEXT,
ADD COLUMN "jobTitleName" TEXT,
ADD COLUMN "city" TEXT,
ADD COLUMN "postalCode" TEXT,
ADD COLUMN "latitude" DOUBLE PRECISION,
ADD COLUMN "longitude" DOUBLE PRECISION,
ADD COLUMN "contractType" "ContractType",
ADD COLUMN "tempsPlein" BOOLEAN,
ADD COLUMN "salaireMin" INTEGER,
ADD COLUMN "salaireMax" INTEGER,
ADD COLUMN "startDate" TIMESTAMP(3),
ADD COLUMN "profilRecherche" TEXT;

-- AddForeignKey
ALTER TABLE "JobOffer" ADD CONSTRAINT "JobOffer_jobTitleId_fkey" FOREIGN KEY ("jobTitleId") REFERENCES "JobTitle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
