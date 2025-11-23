/*
  Warnings:

  - You are about to drop the column `account_token` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "account_token",
ADD COLUMN     "access_token" TEXT;
