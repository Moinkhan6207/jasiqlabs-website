/*
  Warnings:

  - You are about to drop the column `message` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Lead` table. All the data in the column will be lost.
  - Changed the type of `interestType` on the `Lead` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "message",
DROP COLUMN "status",
DROP COLUMN "interestType",
ADD COLUMN     "interestType" TEXT NOT NULL,
ALTER COLUMN "division" DROP NOT NULL;
