-- AlterTable
ALTER TABLE "AppProfile" ADD COLUMN "address" TEXT;
ALTER TABLE "AppProfile" ADD COLUMN "hasResume" BOOLEAN NOT NULL DEFAULT false;
