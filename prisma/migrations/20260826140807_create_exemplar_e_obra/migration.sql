-- CreateTable
CREATE TABLE "exemplar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "codigoIndetificador" TEXT NOT NULL,
    "estadoDeConservacao" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "obra" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exemplarId" INTEGER NOT NULL,
    "isbn" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "editora" TEXT NOT NULL,
    "genero" TEXT NOT NULL,
    "statusDisponibilidade" TEXT NOT NULL DEFAULT 'Disponível',
    CONSTRAINT "obra_exemplarId_fkey" FOREIGN KEY ("exemplarId") REFERENCES "exemplar" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
