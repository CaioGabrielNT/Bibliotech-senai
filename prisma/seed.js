"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../src/config/prisma");
async function main() {
    console.log('Iniciando o seed da base de dados do BiblioTech...');
    const romance = await prisma_1.prisma.obra.create({
        data: { titulo: 'Dom Casmurro', isbn: '9788535910663', autor: 'Machado de Assis', editora: 'Ática', genero: 'Romance' },
    });
    const ficcao = await prisma_1.prisma.obra.create({
        data: { titulo: '1984', isbn: '9788535914849', autor: 'George Orwell', editora: 'Companhia das Letras', genero: 'Ficção' },
    });
    const tecnico = await prisma_1.prisma.obra.create({
        data: { titulo: 'Clean Code', isbn: '9780132350884', autor: 'Robert C. Martin', editora: 'Prentice Hall', genero: 'Técnico' },
    });
    console.log('Obras criadas: Dom Casmurro, 1984, Clean Code.');
    await prisma_1.prisma.exemplar.createMany({
        data: [
            { obraId: romance.obraId, estadoDeConservacao: 'Novo', codigoIdentificador: 'EX-001' },
            { obraId: romance.obraId, estadoDeConservacao: 'Bom', codigoIdentificador: 'EX-002' },
            { obraId: ficcao.obraId, estadoDeConservacao: 'Bom', codigoIdentificador: 'EX-009' },
            { obraId: ficcao.obraId, estadoDeConservacao: 'Desgastado', codigoIdentificador: 'EX-008' },
            { obraId: tecnico.obraId, estadoDeConservacao: 'Novo', codigoIdentificador: 'EX-0010' },
        ],
    });
    console.log('5 exemplares criados (5 disponíveis).');
    const senhaHash = await bcryptjs_1.default.hash('123456', 10);
    await prisma_1.prisma.cliente.create({
        data: {
            nome: 'Leitor Teste',
            matricula: '2026001',
            email: 'leitor@teste.com',
            senha: senhaHash,
            telefone: '11999999999',
            possuiPendencia: false,
        },
    });
    console.log('Leitor de teste criado (matrícula: 2026001, email: leitor@teste.com, senha: 123456).');
    console.log('Seed concluído com sucesso!');
}
main()
    .catch((erro) => {
    console.error('Erro ao executar o seed:', erro);
    process.exit(1);
})
    .finally(async () => {
    await prisma_1.prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map