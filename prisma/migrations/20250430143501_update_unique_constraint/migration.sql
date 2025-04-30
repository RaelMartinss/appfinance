/*
  Warnings:

  - A unique constraint covering the columns `[symbol,userId]` on the table `portfolio` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "portfolio_symbol_key";

-- CreateIndex
CREATE UNIQUE INDEX "portfolio_symbol_userId_key" ON "portfolio"("symbol", "userId");
