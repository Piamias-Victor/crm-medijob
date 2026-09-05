-- AlterEnum
ALTER TYPE "DocumentCategory" ADD VALUE 'CNI';
ALTER TYPE "DocumentCategory" ADD VALUE 'RIB';
ALTER TYPE "DocumentCategory" ADD VALUE 'DIPLOME';

-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN "nir" TEXT;
ALTER TABLE "Candidate" ADD COLUMN "iban" TEXT;
