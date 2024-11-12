/*
  Warnings:

  - You are about to drop the column `sessionToken` on the `BlueskySession` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `BlueskySession` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `refreshToken` to the `BlueskySession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BlueskySession" DROP COLUMN "sessionToken",
ADD COLUMN     "refreshToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BlueskySession_userId_key" ON "BlueskySession"("userId");
