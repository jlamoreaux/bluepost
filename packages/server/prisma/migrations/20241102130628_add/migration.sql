-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "bskyRefreshToken" TEXT,
ADD COLUMN     "bskyToken" TEXT,
ADD COLUMN     "bskyTokenExpires" TIMESTAMP(3),
ADD COLUMN     "xRefreshToken" TEXT,
ADD COLUMN     "xToken" TEXT,
ADD COLUMN     "xTokenExpires" TIMESTAMP(3);
