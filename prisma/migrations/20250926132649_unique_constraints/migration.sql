/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `documents` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customerId,type]` on the table `documents` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "documents_type_key" ON "public"."documents"("type");

-- CreateIndex
CREATE UNIQUE INDEX "documents_customerId_type_key" ON "public"."documents"("customerId", "type");
