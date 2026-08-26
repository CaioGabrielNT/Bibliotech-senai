-- CreateTable
CREATE TABLE "categorias_livros" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomeCategoria" TEXT NOT NULL,
    "valorDiaria" REAL NOT NULL,
    "valorCaucao" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "livros" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "categoriaId" INTEGER NOT NULL,
    "placa" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "statusDisponibilidade" TEXT NOT NULL DEFAULT 'Disponivel',
    CONSTRAINT "livros_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias_livros" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bibliotecarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "livros_placa_key" ON "livros"("placa");

-- CreateIndex
CREATE UNIQUE INDEX "bibliotecarios_email_key" ON "bibliotecarios"("email");
