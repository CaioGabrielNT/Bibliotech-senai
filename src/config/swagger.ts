import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',

    info: {
      title: 'Bibliotech API',
      version: '1.0.0',
      description:
        'API RESTful do sistema de biblioteca Bibliotech. ' +
        'Fluxo típico: cadastre um cliente, faça login para obter um token JWT ' +
        'e use o botão **Authorize** acima para testar as rotas protegidas.',
    },

    servers: [
      { url: 'http://localhost:3333', description: 'Ambiente de desenvolvimento' },
    ],
    tags: [
      { name: 'Autenticação', description: 'Login e emissão de token JWT' },
      { name: 'Clientes', description: 'Cadastro e consulta de clientes' },
      { name: 'Obras', description: 'Catálogo de obras (livros)' },
      { name: 'Exemplares', description: 'Exemplares físicos de cada obra' },
      { name: 'Empréstimos', description: 'Abertura, devolução e cancelamento de empréstimos' },
    ],

    components: {

      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description:
            'Cole aqui o token devolvido pelo POST /api/auth/login (sem o prefixo "Bearer").',
        },
      },

      schemas: {
        RespostaErro: {
          type: 'object',
          properties: {
            erro: { type: 'string', example: 'Mensagem explicando o que deu errado.' },
          },
        },

        Cliente: {
          type: 'object',
          description: 'Cliente SEM o campo senha (a senha nunca sai do banco).',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Cliente Teste' },
            matricula: { type: 'string', example: '2026099' },
            email: { type: 'string', format: 'email', example: 'cliente@teste.com' },
            telefone: { type: 'string', example: '11999999999' },
            criadoEm: { type: 'string', format: 'date-time' },
          },
        },

        Obra: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            titulo: { type: 'string', example: 'Dom Casmurro' },
            isbn: { type: 'string', example: '9788508171742' },
            autor: { type: 'string', example: 'Machado de Assis' },
            editora: { type: 'string', example: 'Ática' },
            genero: { type: 'string', example: 'Romance' },
          },
        },

        Exemplar: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            obraId: { type: 'integer', example: 1 },
            codigoIdentificador: { type: 'string', example: 'EX-001' },
            estadoDeConservacao: { type: 'string', example: 'Bom' },
            statusDisponibilidade: {
              type: 'string',
              enum: ['Disponivel', 'Emprestado'],
              example: 'Disponivel',
            },
            obra: { $ref: '#/components/schemas/Obra' },
          },
        },

        Emprestimo: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            clienteId: { type: 'integer', example: 1 },
            exemplarId: { type: 'integer', example: 1 },
            dataRetirada: { type: 'string', format: 'date-time' },
            dataPrevistaDevolucao: { type: 'string', format: 'date-time' },
            dataDevolucaoReal: { type: 'string', format: 'date-time', nullable: true },
            statusContrato: {
              type: 'string',
              enum: ['Ativo', 'Finalizado', 'Cancelado'],
              example: 'Ativo',
            },
            exemplar: { $ref: '#/components/schemas/Exemplar' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './dist/routes/*.js'],
});