/*
  Warnings:

  - Made the column `lastFetchedAt` on table `Character` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Character" ALTER COLUMN "lastFetchedAt" SET NOT NULL,
ALTER COLUMN "lastFetchedAt" SET DEFAULT CURRENT_TIMESTAMP;
