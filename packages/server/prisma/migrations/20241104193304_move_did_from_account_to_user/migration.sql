/*
  Warnings:

  - You are about to drop the column `bskyDid` on the `Account` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bskyDid]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "bskyDid";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bskyDid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_bskyDid_key" ON "User"("bskyDid");
