/*
  Warnings:

  - You are about to alter the column `name` on the `customers` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `password` on the `customers` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `phone` on the `customers` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `avatarPath` on the `customers` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `customerId` on the `documents` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `value` on the `documents` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `issuingAuthority` on the `documents` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.

*/
-- DropForeignKey
ALTER TABLE "public"."documents" DROP CONSTRAINT "documents_customerId_fkey";

-- AlterTable
ALTER TABLE "public"."customers" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "avatarPath" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "public"."documents" ALTER COLUMN "customerId" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "value" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "issuingAuthority" SET DATA TYPE VARCHAR(20);

-- AddForeignKey
ALTER TABLE "public"."documents" ADD CONSTRAINT "documents_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
