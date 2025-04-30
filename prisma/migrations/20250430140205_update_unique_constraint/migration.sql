/*
  Warnings:

  - A unique constraint covering the columns `[symbol,userId]` on the table `favoritos` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "favoritos_symbol_key";

-- CreateIndex
CREATE UNIQUE INDEX "favoritos_symbol_userId_key" ON "favoritos"("symbol", "userId");
