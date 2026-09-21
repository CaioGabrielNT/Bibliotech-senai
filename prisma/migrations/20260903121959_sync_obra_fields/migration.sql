/*
  Warnings:

  - You are about to drop the column `estadoConservacao` on the `exemplar` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `exemplar` table. All the data in the column will be lost.
  - Added the required column `estadoDeConservacao` to the `exemplar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estadoDeConservacao` to the `obra` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_exemplar" (
    "exemplarId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "obraId" INTEGER NOT NULL,
    "codigoIdentificador" TEXT NOT NULL,
    "estadoDeConservacao" TEXT NOT NULL,
    "statusDisponibilidade" TEXT NOT NULL DEFAULT 'Disponivel',
    CONSTRAINT "exemplar_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "obra" ("obraId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_exemplar" ("codigoIdentificador", "exemplarId", "obraId") SELECT "codigoIdentificador", "exemplarId", "obraId" FROM "exemplar";
DROP TABLE "exemplar";
ALTER TABLE "new_exemplar" RENAME TO "exemplar";
CREATE UNIQUE INDEX "exemplar_codigoIdentificador_key" ON "exemplar"("codigoIdentificador");
CREATE TABLE "new_obra" (
    "obraId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "isbn" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "editora" TEXT NOT NULL,
    "genero" TEXT NOT NULL,
    "estadoDeConservacao" TEXT NOT NULL,
    "statusDisponibilidade" TEXT NOT NULL DEFAULT 'Disponivel'
);
INSERT INTO "new_obra" ("autor", "editora", "genero", "isbn", "obraId", "statusDisponibilidade", "titulo") SELECT "autor", "editora", "genero", "isbn", "obraId", "statusDisponibilidade", "titulo" FROM "obra";
DROP TABLE "obra";
ALTER TABLE "new_obra" RENAME TO "obra";
CREATE UNIQUE INDEX "obra_isbn_key" ON "obra"("isbn");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
