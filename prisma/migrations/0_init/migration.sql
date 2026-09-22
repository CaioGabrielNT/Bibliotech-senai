-- CreateTable
CREATE TABLE "cliente" (
    "clienteId" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "possuiPendencia" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("clienteId")
);

-- CreateTable
CREATE TABLE "obra" (
    "obraId" SERIAL NOT NULL,
    "isbn" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "editora" TEXT NOT NULL,
    "genero" TEXT NOT NULL,

    CONSTRAINT "obra_pkey" PRIMARY KEY ("obraId")
);

-- CreateTable
CREATE TABLE "exemplar" (
    "exemplarId" SERIAL NOT NULL,
    "obraId" INTEGER NOT NULL,
    "codigoIdentificador" TEXT NOT NULL,
    "estadoDeConservacao" TEXT NOT NULL,
    "statusDisponibilidade" TEXT NOT NULL DEFAULT 'Disponivel',

    CONSTRAINT "exemplar_pkey" PRIMARY KEY ("exemplarId")
);

-- CreateTable
CREATE TABLE "emprestimos" (
    "emprestimoId" SERIAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "exemplarId" INTEGER NOT NULL,
    "dataRetirada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataPrevistaDevolucao" TIMESTAMP(3) NOT NULL,
    "dataDevolucaoReal" TIMESTAMP(3),
    "statusContrato" TEXT NOT NULL DEFAULT 'Ativo',

    CONSTRAINT "emprestimos_pkey" PRIMARY KEY ("emprestimoId")
);

-- CreateIndex
CREATE UNIQUE INDEX "cliente_matricula_key" ON "cliente"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "cliente_email_key" ON "cliente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "obra_isbn_key" ON "obra"("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "exemplar_codigoIdentificador_key" ON "exemplar"("codigoIdentificador");

-- AddForeignKey
ALTER TABLE "exemplar" ADD CONSTRAINT "exemplar_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "obra"("obraId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emprestimos" ADD CONSTRAINT "emprestimos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "cliente"("clienteId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emprestimos" ADD CONSTRAINT "emprestimos_exemplarId_fkey" FOREIGN KEY ("exemplarId") REFERENCES "exemplar"("exemplarId") ON DELETE RESTRICT ON UPDATE CASCADE;

