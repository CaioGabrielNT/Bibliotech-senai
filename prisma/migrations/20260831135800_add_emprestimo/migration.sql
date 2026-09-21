/*
  Warnings:

  - The primary key for the `cliente` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `cliente` table. All the data in the column will be lost.
  - The primary key for the `exemplar` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `codigoIndetificador` on the `exemplar` table. All the data in the column will be lost.
  - You are about to drop the column `estadoDeConservacao` on the `exemplar` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `exemplar` table. All the data in the column will be lost.
  - You are about to drop the column `titulo` on the `exemplar` table. All the data in the column will be lost.
  - The primary key for the `obra` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `exemplarId` on the `obra` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `obra` table. All the data in the column will be lost.
  - Added the required column `clienteId` to the `cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codigoIdentificador` to the `exemplar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estadoConservacao` to the `exemplar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exemplarId` to the `exemplar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `obraId` to the `exemplar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `obraId` to the `obra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titulo` to the `obra` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "emprestimos" (
    "emprestimoId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clienteId" INTEGER NOT NULL,
    "exemplarId" INTEGER NOT NULL,
    "dataRetirada" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataPrevistaDevolucao" DATETIME NOT NULL,
    "dataDevolucaoReal" DATETIME,
    "statusContrato" TEXT NOT NULL DEFAULT 'Ativo',
    CONSTRAINT "emprestimos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "cliente" ("clienteId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "emprestimos_exemplarId_fkey" FOREIGN KEY ("exemplarId") REFERENCES "exemplar" ("exemplarId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_cliente" (
    "clienteId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "possuiPendencia" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_cliente" ("criadoEm", "email", "matricula", "nome", "senha", "telefone") SELECT "criadoEm", "email", "matricula", "nome", "senha", "telefone" FROM "cliente";
DROP TABLE "cliente";
ALTER TABLE "new_cliente" RENAME TO "cliente";
CREATE UNIQUE INDEX "cliente_matricula_key" ON "cliente"("matricula");
CREATE UNIQUE INDEX "cliente_email_key" ON "cliente"("email");
CREATE TABLE "new_exemplar" (
    "exemplarId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "obraId" INTEGER NOT NULL,
    "codigoIdentificador" TEXT NOT NULL,
    "estadoConservacao" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Disponivel',
    CONSTRAINT "exemplar_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "obra" ("obraId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_exemplar" ("status") SELECT "status" FROM "exemplar";
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
    "statusDisponibilidade" TEXT NOT NULL DEFAULT 'Disponivel'
);
INSERT INTO "new_obra" ("autor", "editora", "genero", "isbn", "statusDisponibilidade") SELECT "autor", "editora", "genero", "isbn", "statusDisponibilidade" FROM "obra";
DROP TABLE "obra";
ALTER TABLE "new_obra" RENAME TO "obra";
CREATE UNIQUE INDEX "obra_isbn_key" ON "obra"("isbn");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
