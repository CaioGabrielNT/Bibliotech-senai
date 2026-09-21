-- CreateTable
CREATE TABLE "leitores" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "leitores_matricula_key" ON "leitores"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "leitores_email_key" ON "leitores"("email");
