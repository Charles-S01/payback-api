/*
  Warnings:

  - You are about to drop the column `debtDirection` on the `Debt` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Debt" DROP COLUMN "debtDirection",
ADD COLUMN     "isOwedToUser" BOOLEAN NOT NULL DEFAULT true;
