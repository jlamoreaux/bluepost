/*
  Warnings:

  - Added the required column `aud` to the `BlueskySession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dpop_key` to the `BlueskySession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iss` to the `BlueskySession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scope` to the `BlueskySession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sub` to the `BlueskySession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token_type` to the `BlueskySession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BlueskySession" ADD COLUMN     "aud" TEXT NOT NULL,
ADD COLUMN     "dpop_key" TEXT NOT NULL,
ADD COLUMN     "iss" TEXT NOT NULL,
ADD COLUMN     "scope" TEXT NOT NULL,
ADD COLUMN     "sub" TEXT NOT NULL,
ADD COLUMN     "token_type" TEXT NOT NULL;
