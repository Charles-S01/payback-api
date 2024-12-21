/*
  Warnings:

  - You are about to drop the column `dateCreated` on the `MoneyRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MoneyRequest" DROP COLUMN "dateCreated",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
