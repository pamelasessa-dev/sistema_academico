/*
  Warnings:

  - A unique constraint covering the columns `[id_mockpay]` on the table `pagos` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "pagos" ADD COLUMN     "checkout_url" TEXT,
ADD COLUMN     "id_mockpay" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "pagos_id_mockpay_key" ON "pagos"("id_mockpay");
