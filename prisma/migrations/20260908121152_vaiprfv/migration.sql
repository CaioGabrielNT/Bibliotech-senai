/*
  Warnings:

  - You are about to drop the column `estadoDeConservacao` on the `obra` table. All the data in the column will be lost.
  - You are about to drop the column `statusDisponibilidade` on the `obra` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_obra" (
    "obraId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "isbn" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "editora" TEXT NOT NULL,
    "genero" TEXT NOT NULL
);
INSERT INTO "new_obra" ("autor", "editora", "genero", "isbn", "obraId", "titulo") SELECT "autor", "editora", "genero", "isbn", "obraId", "titulo" FROM "obra";
DROP TABLE "obra";
ALTER TABLE "new_obra" RENAME TO "obra";
CREATE UNIQUE INDEX "obra_isbn_key" ON "obra"("isbn");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
