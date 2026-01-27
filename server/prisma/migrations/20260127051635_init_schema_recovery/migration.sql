/*
  Warnings:

  - You are about to drop the column `sourcePage` on the `Lead` table. All the data in the column will be lost.
  - The `division` column on the `Lead` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `AdminUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('INTERNSHIP', 'FULLTIME', 'CONTRACT', 'PARTTIME');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('PROGRAM', 'SERVICE', 'PRODUCT');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "LeadStatus" ADD VALUE 'CONTACTED';
ALTER TYPE "LeadStatus" ADD VALUE 'CONVERTED';
ALTER TYPE "LeadStatus" ADD VALUE 'REJECTED';

-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "sourcePage",
ADD COLUMN     "message" TEXT,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'Website',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'NEW',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "division",
ADD COLUMN     "division" TEXT NOT NULL DEFAULT 'TWS',
ALTER COLUMN "interestType" SET DEFAULT 'STUDENT';

-- DropTable
DROP TABLE "AdminUser";

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "author" TEXT DEFAULT 'Admin',
    "category" TEXT DEFAULT 'Tech',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobOpening" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "JobType" NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT[],
    "responsibilities" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "applyLink" TEXT,
    "postedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "salaryRange" TEXT,
    "experience" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobOpening_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageContent" (
    "id" TEXT NOT NULL,
    "pageName" TEXT NOT NULL,
    "sectionKey" TEXT NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "description" TEXT,
    "content" JSONB,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DivisionContent" (
    "id" TEXT NOT NULL,
    "type" "ContentType" NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "features" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "coverImage" TEXT,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "seoTitle" TEXT,
    "seoDesc" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DivisionContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalConfig" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_slug_published_idx" ON "BlogPost"("slug", "published");

-- CreateIndex
CREATE INDEX "JobOpening_status_type_idx" ON "JobOpening"("status", "type");

-- CreateIndex
CREATE INDEX "PageContent_pageName_isActive_idx" ON "PageContent"("pageName", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "PageContent_pageName_sectionKey_key" ON "PageContent"("pageName", "sectionKey");

-- CreateIndex
CREATE UNIQUE INDEX "DivisionContent_slug_key" ON "DivisionContent"("slug");

-- CreateIndex
CREATE INDEX "DivisionContent_type_status_idx" ON "DivisionContent"("type", "status");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalConfig_key_key" ON "GlobalConfig"("key");
