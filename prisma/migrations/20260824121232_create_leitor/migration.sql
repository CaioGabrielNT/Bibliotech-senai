-- CreateTable
CREATE TABLE "leitor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "leitor_telefone_key" ON "leitor"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "leitor_email_key" ON "leitor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "leitor_matricula_key" ON "leitor"("matricula");
