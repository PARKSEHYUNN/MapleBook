-- AlterTable
ALTER TABLE "User" ADD COLUMN     "termsAgreed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "termsAgreedAt" TIMESTAMP(3);
