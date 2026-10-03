-- AlterEnum
ALTER TYPE "ApplicationSource" ADD VALUE 'SPONTANEOUS';

-- AlterTable
ALTER TABLE "Application" ALTER COLUMN "jobOfferId" DROP NOT NULL;
