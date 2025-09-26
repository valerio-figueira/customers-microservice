/*
  Warnings:

  - A unique constraint covering the columns `[value]` on the table `documents` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."documents_type_key";

-- CreateIndex
CREATE UNIQUE INDEX "documents_value_key" ON "public"."documents"("value");
