/*
  Warnings:

  - You are about to drop the column `valorDiaria` on the `categorias_livros` table. All the data in the column will be lost.
  - You are about to drop the column `modelo` on the `livros` table. All the data in the column will be lost.
  - You are about to drop the column `placa` on the `livros` table. All the data in the column will be lost.
  - Added the required column `valorMultaDia` to the `categorias_livros` table without a default value. This is not possible if the table is not empty.
  - Added the required column `autor` to the `livros` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codigo` to the `livros` table without a default value. This is not possible if the table is not empty.
  - Added the required column `editora` to the `livros` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genero` to the `livros` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titulo` to the `livros` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_categorias_livros" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomeCategoria" TEXT NOT NULL,
    "valorMultaDia" REAL NOT NULL,
    "valorCaucao" REAL NOT NULL
);
INSERT INTO "new_categorias_livros" ("id", "nomeCategoria", "valorCaucao") SELECT "id", "nomeCategoria", "valorCaucao" FROM "categorias_livros";
DROP TABLE "categorias_livros";
ALTER TABLE "new_categorias_livros" RENAME TO "categorias_livros";
CREATE TABLE "new_livros" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "categoriaId" INTEGER NOT NULL,
    "codigo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "editora" TEXT NOT NULL,
    "genero" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "estadoConservacao" TEXT NOT NULL DEFAULT 'Bom',
    "statusDisponibilidade" TEXT NOT NULL DEFAULT 'Disponivel',
    CONSTRAINT "livros_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias_livros" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_livros" ("ano", "categoriaId", "id", "statusDisponibilidade") SELECT "ano", "categoriaId", "id", "statusDisponibilidade" FROM "livros";
DROP TABLE "livros";
ALTER TABLE "new_livros" RENAME TO "livros";
CREATE UNIQUE INDEX "livros_codigo_key" ON "livros"("codigo");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
