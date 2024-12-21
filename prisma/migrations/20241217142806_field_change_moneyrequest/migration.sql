/*
  Warnings:

  - You are about to drop the column `createdAt` on the `MoneyRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MoneyRequest" DROP COLUMN "createdAt",
ADD COLUMN     "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "message" TEXT;
