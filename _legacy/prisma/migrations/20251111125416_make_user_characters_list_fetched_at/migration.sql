/*
  Warnings:

  - You are about to drop the column `charactersListFetchedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "charactersListFetchedAt",
ADD COLUMN     "charactersLastFetchedAt" TIMESTAMP(3);
